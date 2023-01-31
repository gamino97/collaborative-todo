import { AtSignIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ToggleTheme } from "components/ToggleTheme";
import { clearCsrf } from "lib/csrf";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "services/logout";
import { useUser } from "services/user";
import TodoIcon from "/todo-icon.svg";
import { useQueryClient } from "@tanstack/react-query";

function LogOut() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await logout();
      toast({
        title: res.message,
        status: "success",
        duration: 2000,
        position: "top",
      });
      onClose();
      await clearCsrf();
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/login");
    } catch (e) {
      console.error(e);
      toast({
        title: "Something went wrong. Try again.",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };
  return (
    <>
      <MenuItem icon={<LockIcon />} onClick={onOpen}>
        Log Out
      </MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log out?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Log out of {data?.name}?</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleLogout}>
              Log out
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

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
            textColor="white"
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
            <LogOut />
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
