'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Flex, Text, Button, useToast } from '@chakra-ui/react';
import { InputControl, NumberInputControl, SelectControl } from 'chakra-ui-react-hook-form';
import { type Dish, useAddDish } from '@/api/useAddDish';

const baseValidation = z.object({
  name: z.string().min(3).max(255),
  preparationTime: z.string().min(1),
});

const pizzaValidation = baseValidation.extend({
  type: z.literal('pizza'),
  noOfSlices: z.coerce.number().min(1).max(12),
  diameter: z.coerce.number().min(1).max(100, "I think 100cm is enough for a pizza, don't you?"),
});

const soupValidation = baseValidation.extend({
  type: z.literal('soup'),
  spicinessScale: z.coerce.number().min(1).max(10, "Slow down, you can't handle that much spice!"),
});

const sandwichValidation = baseValidation.extend({
  type: z.literal('sandwich'),
  slicesOfBread: z.coerce.number().min(1).max(20, "That's a lot of bread!"),
});
const validationSchema = z.union([pizzaValidation, soupValidation, sandwichValidation]);

const mapDish = (data: z.infer<typeof validationSchema>): Dish => {
  switch (data.type) {
    case 'pizza':
      return {
        type: data.type,
        diameter: data.diameter,
        no_of_slices: data.noOfSlices,
        name: data.name,
        preparation_time: data.preparationTime,
      };
    case 'soup':
      return {
        type: data.type,
        spiciness_scale: data.spicinessScale,
        name: data.name,
        preparation_time: data.preparationTime,
      };
    case 'sandwich':
      return {
        type: data.type,
        slices_of_bread: data.slicesOfBread,
        name: data.name,
        preparation_time: data.preparationTime,
      };
  }
};

export default function Home() {
  const toast = useToast();
  const { mutateAsync: addDishMutatate, isLoading } = useAddDish();
  const { control, handleSubmit, watch, reset, setValue } = useForm<
    z.infer<typeof validationSchema>
  >({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      name: '',
      preparationTime: '00:00:00',
      diameter: 0,
      noOfSlices: 0,
      slicesOfBread: 0,
      spicinessScale: 0,
    },
    resolver: zodResolver(validationSchema),
  });

  const foodType = watch('type');

  const onSubmit = async (data: z.infer<typeof validationSchema>) => {
    try {
      await addDishMutatate(mapDish(data));
      toast({
        title: 'Dish added',
        description: 'Your dish was added successfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      reset();
      setValue('type', 'pizza');
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      toast({
        title: 'Error',
        description: error?.message || 'There was an error adding a dish',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Flex flexDirection="column" justifyContent="center" w="full" gap={4}>
        <Text fontSize="6xl" fontWeight="bold" textAlign="center">
          Foodie
        </Text>
        <Text fontSize="2xl" fontWeight="semibold" mb={2} textAlign="center">
          Select your next meal!
        </Text>
        <InputControl
          helperText="What do you call it?"
          name="name"
          label="Dish Name"
          control={control}
        />
        <InputControl
          inputProps={{
            type: 'time',
            step: 1,
          }}
          helperText="How long does it take to make?"
          name="preparationTime"
          label="Praparation time"
          control={control}
        />

        <SelectControl
          control={control}
          helperText="What's your food type?"
          name="type"
          label="Food Type"
          errorMessageText="Select a food type"
        >
          <option value=""></option>
          <option value="pizza">Pizza</option>
          <option value="soup">Soup</option>
          <option value="sandwich">Sandwich</option>
        </SelectControl>
        {foodType === 'pizza' && (
          <>
            <NumberInputControl
              helperText="How many slices?"
              name="noOfSlices"
              label="Number of slices"
              control={control}
            />
            <NumberInputControl
              helperText="How big is it?"
              name="diameter"
              label="Diameter"
              control={control}
            />
          </>
        )}
        {foodType === 'soup' && (
          <NumberInputControl
            helperText="How spicy is it?"
            name="spicinessScale"
            label="Spiciness scale"
            control={control}
          />
        )}
        {foodType === 'sandwich' && (
          <NumberInputControl
            helperText="How many slices of bread?"
            name="slicesOfBread"
            label="Slices of bread"
            control={control}
          />
        )}
        <Button onClick={() => void handleSubmit(onSubmit)()} isLoading={isLoading}>
          Order!
        </Button>
      </Flex>
    </Container>
  );
}
