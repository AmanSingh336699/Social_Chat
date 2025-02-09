import { Skeleton, Stack, Box } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponents";

const LayoutLoader = () => {
  return (
    <Box display="flex" height="calc(100vh - 4rem)" gap="1rem">
      <Box
        width={{ sm: '33.33%', md: '25%' }}
        display={{ xs: 'none', sm: 'block' }}
        height="100%"
      >
        <Skeleton variant="rectangular" height="100vh" />
      </Box>
      <Box flexGrow={1} height="100%">
        <Stack spacing="1rem">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height="5rem" />
          ))}
        </Stack>
      </Box>
      <Box
        width={{ md: '33.33%', lg: '25%' }}
        display={{ xs: 'none', md: 'block' }}
        height="100%"
      >
        <Skeleton variant="rectangular" height="100vh" />
      </Box>
    </Box>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing="0.5rem"
      direction="row"
      padding="0.5rem"
      justifyContent="center"
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </Stack>
  );
};

export { TypingLoader, LayoutLoader };