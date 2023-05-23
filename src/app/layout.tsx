"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dishes",
  description: "Select your next meal!",
};
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>{children}</ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
