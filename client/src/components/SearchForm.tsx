import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useSearchTask } from "hooks/filter";
import { Form } from "react-router-dom";

function SearchForm() {
  const q = useSearchTask();
  return (
    <Form id="search-form" role="search">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          id="q"
          aria-label="Search tasks"
          placeholder="Search"
          type="search"
          name="q"
          defaultValue={q}
        />
        <div id="search-spinner" aria-hidden hidden={true} />
        <div className="sr-only" aria-live="polite"></div>
      </InputGroup>
    </Form>
  );
}

export default SearchForm;
