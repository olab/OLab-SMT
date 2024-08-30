/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import createTheme from "@mui/material/styles/createTheme";

// Material Dashboard 2 PRO React base styles
import borders from "@/assets/theme/base/borders";
import boxShadows from "@/assets/theme/base/boxShadows";
import breakpoints from "@/assets/theme/base/breakpoints";
import colors from "@/assets/theme/base/colors";
import globals from "@/assets/theme/base/globals";
import typography from "@/assets/theme/base/typography";

// Material Dashboard 2 PRO React helper functions
import boxShadow from "@/assets/theme/functions/boxShadow";
import hexToRgb from "@/assets/theme/functions/hexToRgb";
import linearGradient from "@/assets/theme/functions/linearGradient";
import pxToRem from "@/assets/theme/functions/pxToRem";
import rgba from "@/assets/theme/functions/rgba";

// Material Dashboard 2 PRO React components base styles for @mui material components
import appBar from "@/assets/theme/components/appBar";
import autocomplete from "@/assets/theme/components/form/autocomplete";
import avatar from "@/assets/theme/components/avatar";
import breadcrumbs from "@/assets/theme/components/breadcrumbs";
import button from "@/assets/theme/components/button";
import buttonBase from "@/assets/theme/components/buttonBase";
import card from "@/assets/theme/components/card";
import cardContent from "@/assets/theme/components/card/cardContent";
import cardMedia from "@/assets/theme/components/card/cardMedia";
import checkbox from "@/assets/theme/components/form/checkbox";
import container from "@/assets/theme/components/container";
import dialog from "@/assets/theme/components/dialog";
import dialogActions from "@/assets/theme/components/dialog/dialogActions";
import dialogContent from "@/assets/theme/components/dialog/dialogContent";
import dialogContentText from "@/assets/theme/components/dialog/dialogContentText";
import dialogTitle from "@/assets/theme/components/dialog/dialogTitle";
import divider from "@/assets/theme/components/divider";
import flatpickr from "@/assets/theme/components/flatpickr";
import formControlLabel from "@/assets/theme/components/form/formControlLabel";
import formLabel from "@/assets/theme/components/form/formLabel";
import icon from "@/assets/theme/components/icon";
import iconButton from "@/assets/theme/components/iconButton";
import input from "@/assets/theme/components/form/input";
import inputLabel from "@/assets/theme/components/form/inputLabel";
import inputOutlined from "@/assets/theme/components/form/inputOutlined";
import linearProgress from "@/assets/theme/components/linearProgress";
import link from "@/assets/theme/components/link";
import list from "@/assets/theme/components/list";
import listItem from "@/assets/theme/components/list/listItem";
import listItemText from "@/assets/theme/components/list/listItemText";
import menu from "@/assets/theme/components/menu";
import menuItem from "@/assets/theme/components/menu/menuItem";
import popover from "@/assets/theme/components/popover";
import radio from "@/assets/theme/components/form/radio";
import select from "@/assets/theme/components/form/select";
import sidenav from "@/assets/theme/components/sidenav";
import slider from "@/assets/theme/components/slider";
import snackbar from "@/assets/theme/components/snackbar";
import step from "@/assets/theme/components/stepper/step";
import stepConnector from "@/assets/theme/components/stepper/stepConnector";
import stepIcon from "@/assets/theme/components/stepper/stepIcon";
import stepLabel from "@/assets/theme/components/stepper/stepLabel";
import stepper from "@/assets/theme/components/stepper";
import svgIcon from "@/assets/theme/components/svgIcon";
import switchButton from "@/assets/theme/components/form/switchButton";
import tab from "@/assets/theme/components/tabs/tab";
import tableCell from "@/assets/theme/components/table/tableCell";
import tableContainer from "@/assets/theme/components/table/tableContainer";
import tableHead from "@/assets/theme/components/table/tableHead";
import tabs from "@/assets/theme/components/tabs";
import textField from "@/assets/theme/components/form/textField";
import tooltip from "@/assets/theme/components/tooltip";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors},
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...flatpickr,
        ...container,
      },
    },
    MuiAppBar: { ...appBar },
    MuiAutocomplete: { ...autocomplete },
    MuiAvatar: { ...avatar },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiButton: { ...button },
    MuiButtonBase: { ...buttonBase },
    MuiCard: { ...card },
    MuiCardContent: { ...cardContent },
    MuiCardMedia: { ...cardMedia },
    MuiCheckbox: { ...checkbox },
    MuiDialog: { ...dialog },
    MuiDialogActions: { ...dialogActions },
    MuiDialogContent: { ...dialogContent },
    MuiDialogContentText: { ...dialogContentText },
    MuiDialogTitle: { ...dialogTitle },
    MuiDivider: { ...divider },
    MuiDrawer: { ...sidenav },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiIcon: { ...icon },
    MuiIconButton: { ...iconButton },
    MuiInput: { ...input },
    MuiInputLabel: { ...inputLabel },
    MuiLinearProgress: { ...linearProgress },
    MuiLink: { ...link },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiOutlinedInput: { ...inputOutlined },
    MuiPopover: { ...popover },
    MuiRadio: { ...radio },
    MuiSelect: { ...select },
    MuiSlider: { ...slider },
    MuiSnackbarContent: { ...snackbar },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepIcon: { ...stepIcon },
    MuiStepLabel: { ...stepLabel },
    MuiStepper: { ...stepper },
    MuiSvgIcon: { ...svgIcon },
    MuiSwitch: { ...switchButton },
    MuiTab: { ...tab },
    MuiTableCell: { ...tableCell },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTabs: { ...tabs },
    MuiTextField: { ...textField },
    MuiTooltip: { ...tooltip },
  },
});
