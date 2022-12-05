import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  IconButton, useColorMode
} from "@chakra-ui/react";

function ToggleTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label={"Toggle theme"}
      icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      variant="unstyled"
      colorScheme="white"
      textColor="white"
    />
  );
}

export { ToggleTheme };
