import { AtSignIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Center,
  CircularProgress,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ToggleTheme } from "components/ToggleTheme";
import { Link } from "react-router-dom";
import { useUser } from "services/user";
import TodoIcon from "/todo-icon.svg";

function MyAvatar() {
  const { isLoading, isError, data, isLoggedIn } = useUser();
  if (isLoading) return <CircularProgress isIndeterminate color="green.300" />;
  if (isError) return <Avatar size="sm" />;
  return (
    <>
      <Menu>
        <MenuButton>
          <Box
            as="span"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              name={data.name}
              size="sm"
              bg="teal.500"
              textColor="white"
              mr="5px"
            />
            {data.name}
          </Box>
        </MenuButton>
        <MenuList>
          {isLoggedIn ? (
            <MenuItem icon={<LockIcon />}>Log Out</MenuItem>
          ) : (
            <>
              <MenuItem as={Link} to="/login" icon={<AtSignIcon />}>
                Log in
              </MenuItem>
              <MenuItem as={Link} to="/register" icon={<StarIcon />}>
                Sign Up
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </>
  );
}

export default function Navbar() {
  return (
    <Flex
      paddingX="20px"
      width="full"
      justifyContent="space-between"
      as="nav"
      bgColor="purple.500"
      height="50px"
    >
      <Center>
        <img src={TodoIcon} alt="Todo Icon" width="30" height="30" />
        <Text as="h1" marginLeft="5px" textColor="white">
          Collaborative Todo List
        </Text>
      </Center>
      <Center>
        <ToggleTheme />
        <MyAvatar />
      </Center>
    </Flex>
  );
}
