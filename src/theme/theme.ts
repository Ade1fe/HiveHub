
import { extendTheme } from "@chakra-ui/react";
import { withProse } from '@nikolovlazar/chakra-ui-prose'

const theme = extendTheme({
  colors: {
    black: {
      100: "#000",
      200: "#00082F",
    },
    white: {
      100: "#fff",
    },
    blue: {
      100: "#0077B6",
      200: "#00B4D8",
      300: '#023e8a',
    }
  },
},
withProse(),
);

export default theme;
