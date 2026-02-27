declare module '@mui/material/styles' {
  interface TypographyVariants {
    display: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
  }
}
