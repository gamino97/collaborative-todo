import NoTaskImage from "/no-task.png";
import { Center, Heading, Kbd } from "@chakra-ui/react";

const NoTask = () => {
  // useEffect(() => {
  //   fetch("http://localhost:5000/api/getcsrf", {
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       const csrfToken = res.headers.get("X-CSRFToken");
  //       console.log(csrfToken);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);
  return (
    <>
      <Center>
        <img src={NoTaskImage} alt="No task" />
      </Center>
      <Center>
        <Heading as="h2" size="xl">
          You don&apos;t have any tasks.
        </Heading>
      </Center>
      <Center>
        <span>
          Press <Kbd>alt</Kbd> + <Kbd>N</Kbd> to create tasks.
        </span>
      </Center>
    </>
  );
};

export default NoTask;
