// https://chakra-ui.com/docs/components/breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorMode,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function NavigationBreadcrumbsComponent({ location }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Breadcrumb
      padding="3"
      spacing="2"
      backgroundColor={colorMode === "light" ? "gray.100" : "gray.700"}
      separator={<ChevronRightIcon />}
    >
      <BreadcrumbItem marginLeft="10">
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      {location.map((locationEntry) => (
        <BreadcrumbItem>
          <BreadcrumbLink href={locationEntry.destination}>
            {locationEntry.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
