
// Material Dashboard 2 PRO React base styles
import colors from "@/assets/theme/base/colors";
import typography from "@/assets/theme/base/typography";

const { secondary } = colors;
const { size, fontWeightRegular } = typography;


const snackbar = {

  styleOverrides: {
    root: {
      background: secondary.main,
      color: "white",
      anchorOrigin: { vertical: "bottom", horizontal: "right" }
    }
  },
};

export default snackbar;
