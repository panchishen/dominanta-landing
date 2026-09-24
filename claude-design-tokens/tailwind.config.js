/* Кристалис — дизайн-токены. Сгенерировано из Figma (ro7HcMQfATSiCQa6IbhYCc). Не редактировать вручную. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
          "colors": {
                "accent": {
                      "50": "#F5FCE0",
                      "100": "#E9F9B8",
                      "200": "#D8F584",
                      "300": "#C6F157",
                      "400": "#BFF44A",
                      "500": "#B4F03A",
                      "600": "#97D219",
                      "700": "#739E0E",
                      "800": "#4F6E0A",
                      "900": "#1F3304"
                },
                "error": {
                      "50": "#FCEBEB",
                      "500": "#D83A3A",
                      "600": "#B62A2A"
                },
                "info": {
                      "50": "#E9F1FD",
                      "500": "#2E73D6",
                      "600": "#1F5AB0"
                },
                "neutral": {
                      "0": "#FFFFFF",
                      "50": "#F7F9FA",
                      "100": "#EFF2F4",
                      "200": "#E2E7EA",
                      "300": "#CBD3D8",
                      "400": "#9FAAB1",
                      "500": "#6E7A82",
                      "600": "#515C64",
                      "700": "#3B454C",
                      "800": "#252D32",
                      "900": "#141A1E"
                },
                "primary": {
                      "50": "#EEEEFB",
                      "100": "#D9DAF6",
                      "200": "#B7B8EE",
                      "300": "#9092E6",
                      "400": "#6366DA",
                      "500": "#3538CD",
                      "600": "#2A2DAE",
                      "700": "#23258C",
                      "800": "#1D1E6E",
                      "900": "#161747"
                },
                "success": {
                      "50": "#E7F6EE",
                      "500": "#1E9E5A",
                      "600": "#157A45"
                },
                "warning": {
                      "50": "#FDF3E2",
                      "500": "#E08A12",
                      "600": "#B86E0C"
                },
                "brand": {
                      "50": "#F5FCE0",
                      "100": "#E9F9B8",
                      "200": "#D8F584",
                      "300": "#C6F157",
                      "400": "#BFF44A",
                      "500": "#B4F03A",
                      "600": "#97D219",
                      "700": "#739E0E",
                      "800": "#4F6E0A",
                      "900": "#1F3304",
                      "on": "#1F3304"
                }
          },
          "spacing": {
                "2xl": "48px",
                "2xs": "4px",
                "3xl": "64px",
                "3xs": "2px",
                "4xl": "96px",
                "5xl": "128px",
                "container-x": "24px",
                "grid-gap": "24px",
                "lg": "24px",
                "md": "16px",
                "section-y": "96px",
                "section-y-mobile": "56px",
                "sm": "12px",
                "xl": "32px",
                "xs": "8px"
          },
          "borderRadius": {
                "2xl": "32px",
                "full": "9999px",
                "lg": "16px",
                "md": "12px",
                "none": "0px",
                "sm": "8px",
                "xl": "24px",
                "xs": "4px"
          },
          "boxShadow": {
                "focus": "0px 0px 0px 4px #97D21940",
                "lg": "0px 12px 28px 0px #101E281F",
                "md": "0px 6px 16px 0px #101E281A",
                "sm": "0px 2px 6px 0px #101E2814",
                "xl": "0px 24px 48px 0px #101E2829",
                "xs": "0px 1px 2px 0px #101E280F"
          },
          "screens": {
                "desktop": "1440px",
                "laptop": "1024px",
                "mobile": "375px",
                "tablet": "768px"
          },
          "fontFamily": {
                "sans": [
                      "Onest",
                      "system-ui",
                      "sans-serif"
                ]
          },
          "fontSize": {
                "body-lg": [
                      "18px",
                      {
                            "lineHeight": "28px",
                            "letterSpacing": "0",
                            "fontWeight": "400"
                      }
                ],
                "body-md": [
                      "16px",
                      {
                            "lineHeight": "26px",
                            "letterSpacing": "0",
                            "fontWeight": "400"
                      }
                ],
                "body-sm": [
                      "14px",
                      {
                            "lineHeight": "22px",
                            "letterSpacing": "0",
                            "fontWeight": "400"
                      }
                ],
                "button-lg": [
                      "17px",
                      {
                            "lineHeight": "24px",
                            "letterSpacing": "0",
                            "fontWeight": "600"
                      }
                ],
                "button-md": [
                      "15px",
                      {
                            "lineHeight": "20px",
                            "letterSpacing": "0",
                            "fontWeight": "600"
                      }
                ],
                "button-sm": [
                      "14px",
                      {
                            "lineHeight": "18px",
                            "letterSpacing": "0",
                            "fontWeight": "600"
                      }
                ],
                "caption": [
                      "12px",
                      {
                            "lineHeight": "16px",
                            "letterSpacing": "0",
                            "fontWeight": "400"
                      }
                ],
                "display": [
                      "60px",
                      {
                            "lineHeight": "64px",
                            "letterSpacing": "-0.015em",
                            "fontWeight": "500"
                      }
                ],
                "h1": [
                      "48px",
                      {
                            "lineHeight": "56px",
                            "letterSpacing": "-0.01em",
                            "fontWeight": "500"
                      }
                ],
                "h2": [
                      "38px",
                      {
                            "lineHeight": "46px",
                            "letterSpacing": "-0.005em",
                            "fontWeight": "600"
                      }
                ],
                "h3": [
                      "30px",
                      {
                            "lineHeight": "38px",
                            "letterSpacing": "0",
                            "fontWeight": "600"
                      }
                ],
                "h4": [
                      "24px",
                      {
                            "lineHeight": "32px",
                            "letterSpacing": "0",
                            "fontWeight": "600"
                      }
                ],
                "h5": [
                      "20px",
                      {
                            "lineHeight": "28px",
                            "letterSpacing": "0",
                            "fontWeight": "600"
                      }
                ],
                "label-lg": [
                      "16px",
                      {
                            "lineHeight": "20px",
                            "letterSpacing": "0",
                            "fontWeight": "500"
                      }
                ],
                "label-md": [
                      "14px",
                      {
                            "lineHeight": "18px",
                            "letterSpacing": "0",
                            "fontWeight": "500"
                      }
                ],
                "label-sm": [
                      "12px",
                      {
                            "lineHeight": "16px",
                            "letterSpacing": "0",
                            "fontWeight": "500"
                      }
                ],
                "overline": [
                      "13px",
                      {
                            "lineHeight": "16px",
                            "letterSpacing": "0.08em",
                            "fontWeight": "600"
                      }
                ],
                "quote": [
                      "22px",
                      {
                            "lineHeight": "32px",
                            "letterSpacing": "0",
                            "fontWeight": "500"
                      }
                ]
          },
          "opacity": {
                "backdrop": "0.5",
                "disabled": "0.4",
                "hover": "0.08",
                "pressed": "0.12"
          },
          "transitionDuration": {
                "base": "200ms",
                "exit": "150ms",
                "fast": "150ms",
                "moderate": "300ms",
                "slow": "400ms"
          },
          "transitionTimingFunction": {
                "enter": "cubic-bezier(0, 0, 0.2, 1)",
                "exit": "cubic-bezier(0.4, 0, 1, 1)",
                "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
                "standard": "cubic-bezier(0.2, 0, 0, 1)"
          }
    }
  },
  plugins: [],
};
