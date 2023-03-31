export const Injected = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.6505 3.64041C15.6501 3.64062 15.6497 3.64083 15.6493 3.64103L6.05165 8.43985L16.2501 13.5391L26.4484 8.43987L16.8508 3.64103C16.8504 3.64083 16.85 3.64063 16.8496 3.64043C16.6632 3.54806 16.458 3.5 16.25 3.5C16.042 3.5 15.8369 3.54806 15.6505 3.64041ZM28 10.4592L17.5001 15.7091L17.5 28.5205L27.248 23.6465L27.2508 23.6452C27.4757 23.5334 27.665 23.3611 27.7973 23.1477C27.9297 22.9342 27.9999 22.6881 28 22.4369V10.4592ZM15 28.527L15.0001 15.7091L4.50006 10.4591V22.4333C4.49831 22.6849 4.56687 22.9319 4.69807 23.1466C4.82896 23.3608 5.01696 23.5342 5.24095 23.6475C5.24148 23.6477 5.242 23.648 5.24253 23.6483L15 28.527ZM14.5207 31.0824L4.12104 25.8826L4.11759 25.8809C3.47681 25.558 2.93902 25.0625 2.56486 24.4502C2.19154 23.8394 1.99597 23.1365 2.00006 22.4207V10.0486C2.00044 9.33234 2.20062 8.62972 2.5781 8.021C2.95529 7.41274 3.49457 6.92167 4.13537 6.60291C4.13585 6.60267 4.13633 6.60243 4.13681 6.60219L14.534 1.40359L14.5368 1.40221C15.0692 1.13767 15.6556 1 16.25 1C16.8445 1 17.4309 1.13767 17.9633 1.40221L17.966 1.40358L28.3633 6.60219C28.3638 6.60245 28.3643 6.6027 28.3648 6.60295C29.0055 6.92171 29.5448 7.41276 29.922 8.021C30.2994 8.62973 30.4996 9.33168 30.5 10.0479V22.4376C30.4996 23.1538 30.2994 23.8565 29.922 24.4652C29.5448 25.0734 29.0056 25.5644 28.365 25.8831C28.3644 25.8834 28.3638 25.8837 28.3633 25.884L17.9664 31.0824C17.9663 31.0825 17.9665 31.0824 17.9664 31.0824C17.4316 31.3499 16.8415 31.4894 16.2435 31.4894C15.6455 31.4894 15.0554 31.3499 14.5207 31.0824C14.5205 31.0824 14.5208 31.0825 14.5207 31.0824Z"
      fill="#CCCCCC"
    />
  </svg>
);
export const WalletConnect = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={
      background ? { background: 'var(--ck-brand-walletConnect)' } : undefined
    }
  >
    <path
      d="M9.58818 11.8556C13.1293 8.31442 18.8706 8.31442 22.4117 11.8556L22.8379 12.2818C23.015 12.4588 23.015 12.7459 22.8379 12.9229L21.3801 14.3808C21.2915 14.4693 21.148 14.4693 21.0595 14.3808L20.473 13.7943C18.0026 11.3239 13.9973 11.3239 11.5269 13.7943L10.8989 14.4223C10.8104 14.5109 10.6668 14.5109 10.5783 14.4223L9.12041 12.9645C8.94336 12.7875 8.94336 12.5004 9.12041 12.3234L9.58818 11.8556ZM25.4268 14.8706L26.7243 16.1682C26.9013 16.3452 26.9013 16.6323 26.7243 16.8093L20.8737 22.6599C20.6966 22.8371 20.4096 22.8371 20.2325 22.6599L16.0802 18.5076C16.0359 18.4634 15.9641 18.4634 15.9199 18.5076L11.7675 22.6599C11.5905 22.8371 11.3034 22.8371 11.1264 22.66C11.1264 22.66 11.1264 22.6599 11.1264 22.6599L5.27561 16.8092C5.09856 16.6322 5.09856 16.3451 5.27561 16.168L6.57313 14.8706C6.75019 14.6934 7.03726 14.6934 7.21431 14.8706L11.3668 19.023C11.411 19.0672 11.4828 19.0672 11.5271 19.023L15.6793 14.8706C15.8563 14.6934 16.1434 14.6934 16.3205 14.8706L20.473 19.023C20.5172 19.0672 20.589 19.0672 20.6332 19.023L24.7856 14.8706C24.9627 14.6935 25.2498 14.6935 25.4268 14.8706Z"
      fill={background ? 'white' : 'var(--ck-brand-walletConnect)'}
    />
  </svg>
);

export const WalletConnectLegacy = ({ background = false, ...props }) =>
  WalletConnect({ background, ...props });

export const MetaMask = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    style={
      background
        ? {
            background:
              'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
            borderRadius: '27.5%',
          }
        : undefined
    }
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/**
    <defs>
      <linearGradient
        id="paint0_linear_967_843"
        x1="16"
        y1="0"
        x2="16"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.130682" stopColor="var(--ck-brand-metamask-11)" />
        <stop offset="1" stopColor="var(--ck-brand-metamask-12)" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" fill="url(#paint0_linear_967_843)" />
     */}
    <path
      d="M27.2684 4.03027L17.5018 11.2841L19.3079 7.00442L27.2684 4.03027Z"
      fill="var(--ck-brand-metamask-02)"
      stroke="var(--ck-brand-metamask-02)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.7218 4.03027L14.4099 11.3528L12.6921 7.00442L4.7218 4.03027Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.7544 20.8438L21.1532 24.8289L26.7187 26.3602L28.3187 20.9321L23.7544 20.8438Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.69104 20.9321L5.28117 26.3602L10.8467 24.8289L8.24551 20.8438L3.69104 20.9321Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5327 14.1108L8.98181 16.4568L14.5081 16.7022L14.3117 10.7637L10.5327 14.1108Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.4576 14.1111L17.6295 10.6953L17.5018 16.7025L23.0182 16.4571L21.4576 14.1111Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8469 24.8292L14.1647 23.2096L11.2984 20.9717L10.8469 24.8292Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.8257 23.2096L21.1531 24.8292L20.6918 20.9717L17.8257 23.2096Z"
      fill="var(--ck-brand-metamask-08)"
      stroke="var(--ck-brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.1531 24.8296L17.8257 23.21L18.0906 25.3793L18.0612 26.2921L21.1531 24.8296Z"
      fill="var(--ck-brand-metamask-06)"
      stroke="var(--ck-brand-metamask-06)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8469 24.8296L13.9388 26.2921L13.9192 25.3793L14.1647 23.21L10.8469 24.8296Z"
      fill="var(--ck-brand-metamask-06)"
      stroke="var(--ck-brand-metamask-06)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.9877 19.5389L11.2196 18.7242L13.1729 17.8311L13.9877 19.5389Z"
      fill="var(--ck-brand-metamask-09)"
      stroke="var(--ck-brand-metamask-09)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0023 19.5389L18.8171 17.8311L20.7802 18.7242L18.0023 19.5389Z"
      fill="var(--ck-brand-metamask-09)"
      stroke="var(--ck-brand-metamask-09)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8468 24.8289L11.3179 20.8438L8.24561 20.9321L10.8468 24.8289Z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.6821 20.8438L21.1532 24.8289L23.7544 20.9321L20.6821 20.8438Z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.0182 16.4565L17.5018 16.7019L18.0122 19.5387L18.827 17.8308L20.7902 18.7239L23.0182 16.4565Z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2198 18.7239L13.1829 17.8308L13.9878 19.5387L14.5081 16.7019L8.98181 16.4565L11.2198 18.7239Z"
      fill="var(--ck-brand-metamask-03)"
      stroke="var(--ck-brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.98181 16.4565L11.2983 20.9718L11.2198 18.7239L8.98181 16.4565Z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.7901 18.7239L20.6919 20.9718L23.0181 16.4565L20.7901 18.7239Z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.508 16.7021L13.9878 19.5389L14.6356 22.886L14.7828 18.4788L14.508 16.7021Z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5017 16.7021L17.2367 18.4689L17.3545 22.886L18.0121 19.5389L17.5017 16.7021Z"
      fill="var(--ck-brand-metamask-10)"
      stroke="var(--ck-brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0121 19.5388L17.3545 22.886L17.8257 23.2099L20.6918 20.972L20.79 18.7241L18.0121 19.5388Z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2196 18.7241L11.2981 20.972L14.1644 23.2099L14.6355 22.886L13.9877 19.5388L11.2196 18.7241Z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0615 26.2917L18.0908 25.3788L17.8455 25.1628H14.145L13.9192 25.3788L13.9388 26.2917L10.8469 24.8291L11.9267 25.7126L14.1155 27.234H17.875L20.0736 25.7126L21.1533 24.8291L18.0615 26.2917Z"
      fill="var(--ck-brand-metamask-07)"
      stroke="var(--ck-brand-metamask-07)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.8258 23.2096L17.3546 22.8857H14.6357L14.1646 23.2096L13.9191 25.379L14.1449 25.163H17.8454L18.0907 25.379L17.8258 23.2096Z"
      fill="var(--ck-brand-metamask-04)"
      stroke="var(--ck-brand-metamask-04)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.6806 11.7552L28.5149 7.75041L27.2683 4.03027L17.8257 11.0387L21.4575 14.1109L26.591 15.6128L27.7296 14.2876L27.2389 13.9342L28.0241 13.2178L27.4156 12.7465L28.2007 12.1478L27.6806 11.7552Z"
      fill="var(--ck-brand-metamask-05)"
      stroke="var(--ck-brand-metamask-05)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.48486 7.75041L4.3192 11.7552L3.78916 12.1478L4.57441 12.7465L3.97566 13.2178L4.7609 13.9342L4.27012 14.2876L5.39892 15.6128L10.5325 14.1109L14.1644 11.0387L4.72164 4.03027L3.48486 7.75041Z"
      fill="var(--ck-brand-metamask-05)"
      stroke="var(--ck-brand-metamask-05)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.591 15.6122L21.4575 14.1104L23.0181 16.4564L20.6919 20.9716L23.7544 20.9323H28.3186L26.591 15.6122Z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5326 14.1104L5.39897 15.6122L3.69104 20.9323H8.24551L11.2982 20.9716L8.98168 16.4564L10.5326 14.1104Z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5018 16.7018L17.8258 11.0381L19.3177 7.00391H12.6921L14.1645 11.0381L14.5081 16.7018L14.6258 18.4883L14.6356 22.8856H17.3546L17.3742 18.4883L17.5018 16.7018Z"
      fill="var(--ck-brand-metamask-01)"
      stroke="var(--ck-brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Coinbase = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="var(--ck-brand-coinbaseWallet)" />
    {background && (
      <rect
        rx="27%"
        width="20"
        height="20"
        fill="var(--ck-brand-coinbaseWallet)"
      />
    )}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.0001 17C13.8661 17 17.0001 13.866 17.0001 10C17.0001 6.13401 13.8661 3 10.0001 3C6.13413 3 3.00012 6.13401 3.00012 10C3.00012 13.866 6.13413 17 10.0001 17ZM8.25012 7.71429C7.95427 7.71429 7.71441 7.95414 7.71441 8.25V11.75C7.71441 12.0459 7.95427 12.2857 8.25012 12.2857H11.7501C12.046 12.2857 12.2858 12.0459 12.2858 11.75V8.25C12.2858 7.95414 12.046 7.71429 11.7501 7.71429H8.25012Z"
      fill="white"
    />
  </svg>
);

export const Trust = ({ theme = 'light', ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="44"
      height="44"
      fill={
        theme === 'light'
          ? 'var(--ck-brand-trust-02)'
          : 'var(--ck-brand-trust-02b)'
      }
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.0246 11.8662C33.4096 11.8662 33.774 12.0243 34.0421 12.2925C34.3102 12.5675 34.4615 12.9387 34.4546 13.3168C34.3859 17.4143 34.2277 20.5493 33.9321 23.0312C33.6433 25.5131 33.2102 27.3556 32.5571 28.8475C32.1171 29.8443 31.574 30.6693 30.9346 31.3706C30.0752 32.2987 29.0921 32.9725 28.0196 33.6119C27.561 33.8861 27.0843 34.1568 26.5842 34.4408C25.5172 35.0468 24.3441 35.713 23.0146 36.6025C22.5333 36.9256 21.9077 36.9256 21.4265 36.6025C20.0766 35.7026 18.8879 35.0281 17.8112 34.4173C17.5718 34.2815 17.3379 34.1488 17.109 34.0175C15.8509 33.2887 14.7165 32.5943 13.7265 31.5906C13.0665 30.9306 12.4959 30.1262 12.0421 29.1706C11.4234 27.8918 11.004 26.345 10.6946 24.3443C10.2821 21.67 10.0759 18.1706 10.0002 13.3168C9.99336 12.9387 10.1377 12.5675 10.4059 12.2925C10.674 12.0243 11.0452 11.8662 11.4302 11.8662H12.0215C13.8433 11.8731 17.8652 11.6943 21.344 8.98559C21.8596 8.58683 22.5815 8.58683 23.0971 8.98559C26.5759 11.6943 30.5977 11.8731 32.4265 11.8662H33.0246ZM29.8277 27.9331C30.2746 27.0118 30.6459 25.74 30.9277 23.9112C31.2646 21.725 31.4709 18.755 31.5671 14.7125C29.4221 14.6506 25.7371 14.2381 22.224 11.8731C18.7109 14.2312 15.0259 14.6437 12.8877 14.7125C12.9633 18.0537 13.1146 20.6525 13.3552 22.6943C13.6302 25.0181 14.0221 26.5925 14.5102 27.6993C14.8333 28.435 15.1909 28.9643 15.6171 29.4318C16.1877 30.0575 16.9096 30.5731 17.8927 31.1643C18.3005 31.409 18.7502 31.6635 19.2396 31.9406C20.1116 32.4341 21.1099 32.9991 22.224 33.7081C23.3175 33.0107 24.3014 32.4515 25.1633 31.9616C25.4231 31.8139 25.6717 31.6725 25.909 31.5356C27.119 30.8412 28.0127 30.2637 28.6796 29.59C29.1265 29.1293 29.4909 28.6275 29.8277 27.9331Z"
      fill={
        theme === 'light'
          ? 'var(--ck-brand-trust-01)'
          : 'var(--ck-brand-trust-01b)'
      }
    />
  </svg>
);

export const Argent = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" fill="white" />
    <path
      d="M18.3242 7.63647H13.6516C13.4955 7.63647 13.3704 7.76611 13.367 7.92726C13.2726 12.4568 10.9768 16.7559 7.02532 19.8009C6.89986 19.8976 6.87128 20.0792 6.963 20.21L9.69685 24.112C9.78986 24.2448 9.97107 24.2747 10.0986 24.1772C12.5694 22.2856 14.5567 20.0038 15.9879 17.4746C17.4191 20.0038 19.4065 22.2856 21.8773 24.1772C22.0047 24.2747 22.186 24.2448 22.2791 24.112L25.013 20.21C25.1045 20.0792 25.0759 19.8976 24.9506 19.8009C20.999 16.7559 18.7033 12.4568 18.609 7.92726C18.6056 7.76611 18.4803 7.63647 18.3242 7.63647Z"
      fill="var(--ck-brand-argent)"
    />
  </svg>
);

export const ImToken = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      background: `linear-gradient(
      180deg,
      var(--ck-brand-imtoken-01) 0%,
      var(--ck-brand-imtoken-02) 100%
    )`,
    }}
  >
    <path
      d="M26.8543 9.96509C27.5498 19.3857 21.4942 23.8384 16.0655 24.3132C11.0184 24.7546 6.26765 21.6534 5.85087 16.8885C5.50707 12.952 7.94004 11.2761 9.8516 11.109C11.8177 10.9367 13.4698 12.2925 13.6132 13.9342C13.7512 15.5125 12.7664 16.2308 12.0815 16.2906C11.5398 16.3381 10.8584 16.0093 10.7968 15.3032C10.7441 14.6965 10.9744 14.6138 10.9182 13.9693C10.8179 12.8219 9.81731 12.6882 9.26951 12.7357C8.60654 12.7937 7.40368 13.5675 7.5725 15.4949C7.7422 17.439 9.60628 18.9751 12.0498 18.7614C14.6868 18.531 16.5227 16.4779 16.6608 13.5983C16.6595 13.4458 16.6916 13.2948 16.7548 13.156L16.7557 13.1525C16.7841 13.0922 16.8174 13.0342 16.8551 12.9793C16.9113 12.8949 16.9835 12.8016 17.0767 12.6997C17.0775 12.697 17.0775 12.697 17.0793 12.697C17.147 12.6205 17.2288 12.5379 17.3211 12.4491C18.473 11.3623 22.6214 8.79916 26.5448 9.61074C26.6277 9.62851 26.7026 9.67262 26.7584 9.73649C26.8142 9.80035 26.8478 9.88054 26.8543 9.96509"
      fill="white"
    />
  </svg>
);

export const Rainbow = ({ ...props }) => {
  // Here we're using a base64 of an svg because the gradients in this logo do not play nicely on mobile devices
  /*
  const withoutBackground = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF8xXzIwIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIyMCIgeT0iMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik0yMCA2MlYyNkMyMCAyMi42ODYzIDIyLjY4NjMgMjAgMjYgMjBDNjYuODY5MSAyMCAxMDAgNTMuMTMwOSAxMDAgOTRDMTAwIDk3LjMxMzcgOTcuMzEzNyAxMDAgOTQgMTAwSDU4QzU0LjY4NjMgMTAwIDUyIDk3LjMxMzcgNTIgOTRDNTIgNzkuNjQwNiA0MC4zNTk0IDY4IDI2IDY4QzIyLjY4NjMgNjggMjAgNjUuMzEzNyAyMCA2MloiIGZpbGw9IiNDNEM0QzQiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzFfMjApIj4KPG1hc2sgaWQ9Im1hc2sxXzFfMjAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIwIiB5PSIyMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIj4KPHBhdGggZD0iTTIwLjAwMDEgMzhWMjBIMTAwVjEwMEg4Mi4wMDAxVjk0QzgyLjAwMDEgNjMuMDcyMSA1Ni45MjggMzggMjYuMDAwMSAzOEgyMC4wMDAxWiIgZmlsbD0iI0M0QzRDNCIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazFfMV8yMCkiPgo8cGF0aCBkPSJNMCAwSDEyMFYxMjBIMFYwWiIgZmlsbD0iIzY3NTlGRiIvPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzFfMjApIj4KPHBhdGggZD0iTTAgMjZIMjZDNjMuNTU1NCAyNiA5NCA1Ni40NDQ2IDk0IDk0VjEyMEgwVjI2WiIgZmlsbD0iI0ZGNDAwMCIvPgo8L2c+CjwvZz4KPG1hc2sgaWQ9Im1hc2syXzFfMjAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIwIiB5PSIzNiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBhdGggZD0iTTIwIDU0VjM2SDI2QzU4LjAzMjUgMzYgODQgNjEuOTY3NSA4NCA5NFYxMDBINjZWOTRDNjYgNzEuOTA4NiA0OC4wOTE0IDU0IDI2IDU0SDIwWiIgZmlsbD0iI0M0QzRDNCIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazJfMV8yMCkiPgo8cGF0aCBkPSJNMCAzNkg4NFYxMjBIMFYzNloiIGZpbGw9IiNGRjdGMDAiLz4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZl8xXzIwKSI+CjxwYXRoIGQ9Ik0wIDQySDI2QzU0LjcxODggNDIgNzggNjUuMjgxMiA3OCA5NFYxMjBIMFY0MloiIGZpbGw9IiNGRkZGMDAiLz4KPC9nPgo8L2c+CjxtYXNrIGlkPSJtYXNrM18xXzIwIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIyMCIgeT0iNTIiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+CjxwYXRoIGQ9Ik0yMCA2MlY1MkgyNkM0OS4xOTYgNTIgNjggNzAuODA0IDY4IDk0VjEwMEg1OEM1NC42ODYzIDEwMCA1MiA5Ny4zMTM3IDUyIDk0QzUyIDc5LjY0MDYgNDAuMzU5NCA2OCAyNiA2OEMyMi42ODYzIDY4IDIwIDY1LjMxMzcgMjAgNjJaIiBmaWxsPSIjQzRDNEM0Ii8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrM18xXzIwKSI+CjxwYXRoIGQ9Ik0wIDUySDI2QzQ5LjE5NiA1MiA2OCA3MC44MDQgNjggOTRWMTIwSDBWNTJaIiBmaWxsPSIjMDBFNTEzIi8+CjwvZz4KPG1hc2sgaWQ9Im1hc2s0XzFfMjAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIwIiB5PSI1MiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij4KPHBhdGggZD0iTTIwIDEwMFY1MkgyNkM0OS4xOTYgNTIgNjggNzAuODA0IDY4IDk0VjEwMEgyMFoiIGZpbGw9IiNDNEM0QzQiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2s0XzFfMjApIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZl8xXzIwKSI+CjxwYXRoIGQ9Ik0wIDU4SDI2QzQ1Ljg4MjIgNTggNjIgNzQuMTE3NyA2MiA5NFYxMjBIMFY1OFoiIGZpbGw9IiMwMEFBRkYiLz4KPC9nPgo8L2c+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl8xXzIwIiB4PSItMTgiIHk9IjgiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTMwIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjkiIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8xXzIwIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2ZfMV8yMCIgeD0iLTE4IiB5PSIyNCIgd2lkdGg9IjExNCIgaGVpZ2h0PSIxMTQiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iOSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzFfMjAiLz4KPC9maWx0ZXI+CjxmaWx0ZXIgaWQ9ImZpbHRlcjJfZl8xXzIwIiB4PSItMTgiIHk9IjQwIiB3aWR0aD0iOTgiIGhlaWdodD0iOTgiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iOSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzFfMjAiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==';
  */
  const withBackground =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzhIMjZDNTYuOTI3OSAzOCA4MiA2My4wNzIxIDgyIDk0VjEwMEg5NEM5Ny4zMTM3IDEwMCAxMDAgOTcuMzEzNyAxMDAgOTRDMTAwIDUzLjEzMDkgNjYuODY5MSAyMCAyNiAyMEMyMi42ODYzIDIwIDIwIDIyLjY4NjMgMjAgMjZWMzhaIiBmaWxsPSJ1cmwoI3BhaW50MV9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNODQgOTRIMTAwQzEwMCA5Ny4zMTM3IDk3LjMxMzcgMTAwIDk0IDEwMEg4NFY5NFoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiAyMEwyNiAzNkgyMEwyMCAyNkMyMCAyMi42ODYzIDIyLjY4NjMgMjAgMjYgMjBaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzZIMjZDNTguMDMyNSAzNiA4NCA2MS45Njc1IDg0IDk0VjEwMEg2NlY5NEM2NiA3MS45MDg2IDQ4LjA5MTQgNTQgMjYgNTRIMjBWMzZaIiBmaWxsPSJ1cmwoI3BhaW50NF9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNNjggOTRIODRWMTAwSDY4Vjk0WiIgZmlsbD0idXJsKCNwYWludDVfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDUyTDIwIDM2TDI2IDM2TDI2IDUySDIwWiIgZmlsbD0idXJsKCNwYWludDZfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDYyQzIwIDY1LjMxMzcgMjIuNjg2MyA2OCAyNiA2OEM0MC4zNTk0IDY4IDUyIDc5LjY0MDYgNTIgOTRDNTIgOTcuMzEzNyA1NC42ODYzIDEwMCA1OCAxMDBINjhWOTRDNjggNzAuODA0IDQ5LjE5NiA1MiAyNiA1MkgyMFY2MloiIGZpbGw9InVybCgjcGFpbnQ3X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik01MiA5NEg2OFYxMDBINThDNTQuNjg2MyAxMDAgNTIgOTcuMzEzNyA1MiA5NFoiIGZpbGw9InVybCgjcGFpbnQ4X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiA2OEMyMi42ODYzIDY4IDIwIDY1LjMxMzcgMjAgNjJMMjAgNTJMMjYgNTJMMjYgNjhaIiBmaWxsPSJ1cmwoI3BhaW50OV9yYWRpYWxfNjJfMzI5KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzYyXzMyOSIgeDE9IjYwIiB5MT0iMCIgeDI9IjYwIiB5Mj0iMTIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxNzQyOTkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxRTU5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQxX3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDc0KSI+CjxzdG9wIG9mZnNldD0iMC43NzAyNzciIHN0b3AtY29sb3I9IiNGRjQwMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODc1NEM5Ii8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl82Ml8zMjkiIHgxPSI4MyIgeTE9Ijk3IiB4Mj0iMTAwIiB5Mj0iOTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDAwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzYyXzMyOSIgeDE9IjIzIiB5MT0iMjAiIHgyPSIyMyIgeTI9IjM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY0MDAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ0X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDU4KSI+CjxzdG9wIG9mZnNldD0iMC43MjM5MjkiIHN0b3AtY29sb3I9IiNGRkY3MDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5OTAxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ1X2xpbmVhcl82Ml8zMjkiIHgxPSI2OCIgeTE9Ijk3IiB4Mj0iODQiIHkyPSI5NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Nl9saW5lYXJfNjJfMzI5IiB4MT0iMjMiIHkxPSI1MiIgeDI9IjIzIiB5Mj0iMzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRjcwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk5MDEiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDdfcmFkaWFsXzYyXzMyOSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyNiA5NCkgcm90YXRlKC05MCkgc2NhbGUoNDIpIj4KPHN0b3Agb2Zmc2V0PSIwLjU5NTEzIiBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50OF9yYWRpYWxfNjJfMzI5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDUxIDk3KSBzY2FsZSgxNyA0NS4zMzMzKSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMEFBRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ5X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMgNjkpIHJvdGF0ZSgtOTApIHNjYWxlKDE3IDMyMi4zNykiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=';
  return (
    <svg
      {...props}
      aria-hidden="true"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundSize: '100% 100%',
        backgroundImage: `url("${withBackground}")`,
      }}
    />
  );
};
export const Brave = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect rx="27%" width="88" height="88" fill="white"></rect>
    <path
      d="M69.0892 28.2123L70.5781 24.5643L66.3594 20.1967C64.0763 17.9136 59.2123 19.2537 59.2123 19.2537L53.7031 13H34.2721L28.7381 19.2785C28.7381 19.2785 23.8741 17.9632 21.591 20.1967L17.3722 24.5395L18.8612 28.1875L17 33.5974L23.204 57.2472C24.4945 62.3097 25.3631 64.2702 29.011 66.8511L40.352 74.5441C41.4439 75.2142 42.784 76.3805 44 76.3805C45.216 76.3805 46.5561 75.2142 47.648 74.5441L58.989 66.8511C62.6369 64.2702 63.5055 62.3097 64.796 57.2472L71 33.5974L69.0892 28.2123Z"
      fill="url(#paint0_linear_2183_5890)"
    />
    <path
      d="M57.6737 23.2739C57.6737 23.2739 64.796 31.8851 64.796 33.6967C64.796 35.5579 63.9026 36.0294 63.0092 36.9972L57.6737 42.705C57.1774 43.2013 56.1103 44.045 56.7307 45.5092C57.3511 46.9982 58.2197 48.8346 57.227 50.7206C56.2344 52.6314 54.4972 53.8971 53.3805 53.6985C51.7195 53.1594 50.1348 52.4088 48.6654 51.4651C47.7224 50.8447 44.6949 48.3382 44.6949 47.3704C44.6949 46.4026 47.8217 44.6406 48.4173 44.2932C48.9881 43.8961 51.6434 42.3575 51.693 41.7619C51.7427 41.1664 51.7427 41.0175 50.9485 39.5285C50.1544 38.0395 48.7647 36.0542 48.9632 34.7638C49.2114 33.4733 51.4449 32.7785 53.1075 32.1581L58.2445 30.2224C58.6415 30.0239 58.5423 29.8502 57.3511 29.7261C56.1599 29.6268 52.8097 29.1801 51.296 29.602C49.7822 30.0239 47.2509 30.6691 47.0028 31.0165C46.8042 31.364 46.6057 31.364 46.829 32.5551L48.2684 40.3722C48.3677 41.3649 48.5662 42.0349 47.5239 42.2831C46.432 42.5313 44.6204 42.9531 44 42.9531C43.3796 42.9531 41.5432 42.5313 40.4761 42.2831C39.409 42.0349 39.6075 41.3649 39.7316 40.3722C39.8309 39.3796 40.9228 33.7215 41.1461 32.5551C41.3943 31.364 41.171 31.364 40.9724 31.0165C40.7243 30.6691 38.1682 30.0239 36.6544 29.602C35.1654 29.1801 31.7904 29.6268 30.5993 29.7509C29.4081 29.8502 29.3088 29.9991 29.7059 30.2472L34.8428 32.1581C36.4807 32.7785 38.7638 33.4733 38.9871 34.7638C39.2353 36.079 37.8208 38.0395 37.0018 39.5285C36.1829 41.0175 36.2077 41.1664 36.2574 41.7619C36.307 42.3575 38.9871 43.8961 39.5331 44.2932C40.1287 44.6654 43.2555 46.4026 43.2555 47.3704C43.2555 48.3382 40.3024 50.8447 39.3097 51.4651C37.8404 52.4088 36.2557 53.1594 34.5947 53.6985C33.4779 53.8971 31.7408 52.6314 30.7233 50.7206C29.7307 48.8346 30.6241 46.9982 31.2197 45.5092C31.8401 44.0202 30.7978 43.2261 30.2767 42.705L24.9412 36.9972C24.0726 36.079 23.1792 35.5827 23.1792 33.7463C23.1792 31.9099 30.3015 23.3235 30.3015 23.3235L37.0763 24.4154C37.8704 24.4154 39.6324 23.7454 41.2454 23.1746C42.8585 22.6783 43.9752 22.6287 43.9752 22.6287C43.9752 22.6287 45.0671 22.6287 46.705 23.1746C48.3428 23.7206 50.08 24.4154 50.8741 24.4154C51.693 24.4154 57.6985 23.2491 57.6985 23.2491L57.6737 23.2739ZM52.3382 56.2298C52.7849 56.4779 52.512 57.0239 52.0901 57.3217L45.7868 62.2353C45.2904 62.7316 44.4963 63.4761 43.9752 63.4761C43.454 63.4761 42.6847 62.7316 42.1636 62.2353C40.0743 60.5717 37.9648 58.9337 35.8355 57.3217C35.4384 57.0239 35.1654 56.5028 35.5873 56.2298L39.3097 54.2445C40.7894 53.4618 42.3551 52.8539 43.9752 52.4329C44.3474 52.4329 46.705 53.2767 48.6158 54.2445L52.3382 56.2298Z"
      fill="white"
    />
    <path
      d="M59.262 19.2785L53.7032 13H34.2721L28.7381 19.2785C28.7381 19.2785 23.8741 17.9632 21.591 20.1967C21.591 20.1967 28.0432 19.6259 30.2767 23.2491L37.126 24.4154C37.9201 24.4154 39.682 23.7454 41.2951 23.1746C42.9081 22.6783 44.0249 22.6287 44.0249 22.6287C44.0249 22.6287 45.1168 22.6287 46.7546 23.1746C48.3925 23.7206 50.1296 24.4154 50.9238 24.4154C51.7427 24.4154 57.7482 23.2491 57.7482 23.2491C59.9817 19.6259 66.4339 20.1967 66.4339 20.1967C64.1508 17.9136 59.2868 19.2537 59.2868 19.2537"
      fill="url(#paint1_linear_2183_5890)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2183_5890"
        x1="17"
        y1="45.3241"
        x2="71"
        y2="45.3241"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.4" stopColor="#FF5500" />
        <stop offset="0.6" stopColor="#FF2000" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2183_5890"
        x1="22.4879"
        y1="18.8219"
        x2="66.4339"
        y2="18.8219"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF452A" />
        <stop offset="1" stopColor="#FF2000" />
      </linearGradient>
    </defs>
  </svg>
);
export const Crypto = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: 'white' }}
  >
    <mask
      id="mask0_2091_4394"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="13"
      y="9"
      width="62"
      height="71"
    >
      <path
        d="M44 9L13 26.75V62.25L44 80L75 62.25V26.75L44 9ZM31.7577 24.3492H56.1513L59.0935 36.684H28.9307L31.7577 24.3492ZM41.5613 61.2993L36.2955 66.161H31.8427L20.6924 46.9369L28.8701 40.9079L36.0953 45.4627V53.6578L41.5552 58.8504V61.2993H41.5613ZM37.9759 53.1584L38.7888 45.4326L36.1256 38.5432H51.9229L49.3204 45.4326L50.0787 53.1283L44 53.1584H37.9759ZM56.2059 66.1069H51.8076L46.5419 61.2993V58.8564L52.0018 53.6638V45.4627L59.1421 40.8537L67.2955 46.9369L56.2059 66.1069Z"
        fill="#002D74"
      />
    </mask>
    <g mask="url(#mask0_2091_4394)">
      <rect y="8" width="44" height="72" fill="url(#paint0_linear_2091_4394)" />
      <rect
        x="88"
        y="80"
        width="44"
        height="72"
        transform="rotate(-180 88 80)"
        fill="url(#paint1_linear_2091_4394)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_2091_4394"
        x1="22"
        y1="8"
        x2="22"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#010935" />
        <stop offset="1" stopColor="#142C70" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2091_4394"
        x1="110"
        y1="80"
        x2="110"
        y2="152"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#010935" />
        <stop offset="1" stopColor="#142C70" />
      </linearGradient>
    </defs>
  </svg>
);

export const Ledger = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: 'black' }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M37.2106 16H16V29.4577H19.2182V19.2182L37.2106 19.1011V16ZM37.3568 33.4073V54.6179H50.8146V51.3997H40.575L40.458 33.4073H37.3568ZM16 72.1714H37.2106V69.0703L19.2182 68.9533V58.7137H16V72.1714ZM50.9609 16H72.1714V29.4577H68.9533V19.2182L50.9609 19.1011V16ZM72.1714 72.1714H50.9609V69.0703L68.9533 68.9533V58.7137H72.1714V72.1714Z"
      fill="white"
    />
  </svg>
);

export const Steak = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="600"
    height="600"
    viewBox="0 0 600 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: 'black' }}
  >
    <path
      d="M470.747 209.191C462.305 192.354 448.646 178.695 431.808 170.253C413.337 161 389.233 161 341.006 161C331.236 161 307.916 161 300 161C292.084 161 268.728 161 258.994 161C210.856 161 186.662 161 168.191 170.253C151.354 178.69 137.7 192.35 129.27 209.191C119.999 227.662 120 251.767 120 299.976C120 348.185 119.999 372.308 129.27 390.778C137.7 407.619 151.354 421.279 168.191 429.716C186.662 438.97 210.784 438.97 258.994 438.97C268.764 438.97 292.084 438.97 300 438.97C307.916 438.97 331.272 438.97 341.006 438.97C389.144 438.97 413.337 438.97 431.808 429.716C448.646 421.274 462.305 407.616 470.747 390.778C480 372.308 480 348.203 480 299.976C480 251.749 480 227.662 470.747 209.191Z"
      fill="#FFCEAA"
    />
    <path
      d="M218.557 350.342C216.323 345.957 212.922 342.274 208.729 339.698C204.536 337.121 199.713 335.752 194.791 335.741H166.747C163.876 335.755 161.041 336.37 158.422 337.548C155.804 338.725 153.462 340.439 151.547 342.577C149.632 344.716 148.186 347.232 147.303 349.964C146.42 352.696 146.12 355.582 146.422 358.437C147.385 367.476 148.954 374.34 151.575 379.564C157.629 391.573 167.378 401.323 179.388 407.377C188.195 411.798 201.674 413.26 222.444 413.742C225.415 413.812 228.353 413.109 230.97 411.702C233.587 410.295 235.793 408.232 237.373 405.715C238.953 403.199 239.852 400.315 239.982 397.346C240.113 394.378 239.47 391.427 238.116 388.781L218.557 350.342Z"
      fill="#FF3B9A"
    />
    <path
      d="M180.618 312.563C189.852 312.562 198.95 310.335 207.14 306.071C215.33 301.806 222.371 295.63 227.668 288.066L254.856 249.253C259.761 242.25 262.839 234.134 263.81 225.64C264.782 217.146 263.616 208.545 260.419 200.616V200.384C258.913 196.555 256.409 193.2 253.167 190.666C249.925 188.133 246.064 186.514 241.985 185.978C209.732 186.085 190.726 186.887 179.405 192.575C167.37 198.586 157.611 208.339 151.592 220.37C146.725 230.247 145.227 258.007 144.87 280.507C144.797 284.698 145.56 288.862 147.114 292.754C148.668 296.647 150.983 300.191 153.923 303.179C156.863 306.167 160.369 308.539 164.236 310.156C168.103 311.774 172.254 312.604 176.445 312.599L180.618 312.563Z"
      fill="#FF3B9A"
    />
    <path
      d="M449.702 220.356C443.655 208.365 433.909 198.639 421.906 192.614C409.89 186.588 389.262 186.053 353.337 186C304.664 186 289.528 242 279.134 256.834L248.556 300.497C243.645 307.51 240.729 315.725 240.12 324.266C239.511 332.806 241.231 341.352 245.098 348.991L267.758 393.813C270.842 399.931 275.578 405.063 281.43 408.627C287.282 412.191 294.016 414.045 300.867 413.978H301.49C309.495 413.978 334.171 413.978 342.283 413.978C385.072 413.978 408.713 413.977 421.906 407.381C433.914 401.331 443.66 391.58 449.702 379.568C456.317 366.374 456.316 342.787 456.316 299.944C456.316 257.101 456.317 233.621 449.702 220.356Z"
      fill="#FF3B9A"
    />
  </svg>
);

export const Unstoppable = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: 'linear-gradient(180deg, #FED812 0%, #FFAF00 100%)' }}
  >
    <path
      d="M47.4 43.7163C47.4 45.6251 45.8781 47.1714 44.0001 47.1714C42.1219 47.1714 40.6 45.6251 40.6 43.7163L40.6 -7H27L27 43.7163C27 53.2612 34.6106 61 44.0001 61C53.3882 61 61 53.2612 61 43.7163V-7H47.4V43.7163Z"
      fill="#1F2129"
    />
  </svg>
);

export const ONTO = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: 'white' }}
  >
    <path
      d="M20 16L28.675 24.677C32.1885 21.8644 36.4154 20.0873 40.8816 19.545C45.348 19.0026 49.8769 19.7164 53.9604 21.6063C58.0438 23.4963 61.5207 26.4876 64.0005 30.2447C66.4804 34.0019 67.8653 38.3763 68 42.8772V43.5854V72L59.3367 63.3231C55.8263 66.1389 51.6014 67.9196 47.1361 68.4655C42.6708 69.0112 38.1419 68.3007 34.0577 66.4135C29.9734 64.5262 26.4956 61.537 24.0144 57.7813C21.5333 54.0255 20.1472 49.6521 20.0115 45.1515V44.4433L20 16ZM25.931 30.3311V44.4146C25.9323 47.7294 26.8335 50.9817 28.5384 53.8236C30.2432 56.6655 32.6875 58.9902 35.6101 60.5497C38.5328 62.1089 41.8238 62.8439 45.1313 62.6764C48.439 62.5087 51.639 61.4445 54.3894 59.5978L54.8611 59.2754L27.0873 31.4884L25.931 30.3311ZM33.6223 28.4022L33.1505 28.7304L60.9186 56.5117L62.069 57.6632V43.5854C62.0683 40.2717 61.1679 37.0204 59.464 34.179C57.7603 31.3377 55.3171 29.0132 52.3957 27.4539C49.4742 25.8946 46.1844 25.1592 42.8777 25.3262C39.5712 25.4933 36.372 26.5565 33.6223 28.4022Z"
      fill="#23262F"
    />
  </svg>
);
export const Slope = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: '#6C67F1' }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M50.6667 24.3696L34.8872 40.1864L24.0001 37.7402L37.3334 24.3696L48.4438 13.3798C49.268 12.5646 50.6667 13.1484 50.6667 14.3077V24.3696ZM37.3339 51.0358L50.6672 37.74V24.3694L35.2001 39.8737L37.3339 51.0358Z"
      fill="url(#paint0_linear_2593_6077)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M37.3337 64.2947V50.9617L50.667 37.6284L55.7849 45.8435L55.9822 45.6463L64 50.9616L39.5582 75.2343C38.7347 76.0521 37.3336 75.4687 37.3336 74.3082V64.2949L37.3337 64.2947Z"
      fill="url(#paint1_linear_2593_6077)"
    />
    <path
      d="M24 37.7405H32.573C35.202 37.7405 37.3333 39.8718 37.3333 42.5009V51.0359H28.7602C26.1313 51.0359 24 48.9046 24 46.2757V37.7405Z"
      fill="#F1F0FF"
    />
    <path
      d="M50.6667 37.7405H59.2398C61.8688 37.7405 64 39.8718 64 42.5009V51.0359H55.4271C52.798 51.0359 50.6667 48.9046 50.6667 46.2757V37.7405Z"
      fill="#F1F0FF"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2593_6077"
        x1="37.3336"
        y1="13"
        x2="37.3336"
        y2="51.0358"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A8ADFF" />
        <stop offset="0.648556" stopColor="white" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2593_6077"
        x1="50.6668"
        y1="37.6284"
        x2="50.6668"
        y2="75.616"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.260784" stopColor="#B6BAFF" />
        <stop offset="1" stopColor="#E4E2FF" />
      </linearGradient>
    </defs>
  </svg>
);
export const GnosisSafe = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={
      background ? { background: 'var(--ck-brand-gnosisSafe)' } : undefined
    }
  >
    <path
      d="M68.7186 44H62.6472C60.8339 44 59.3646 45.4686 59.3646 47.281V56.0888C59.3646 57.9012 57.8952 59.3697 56.0819 59.3697H31.9278C30.1145 59.3697 28.6452 60.8383 28.6452 62.6507V68.719C28.6452 70.5314 30.1145 72 31.9278 72H57.48C59.2933 72 60.7417 70.5314 60.7417 68.719V63.8504C60.7417 62.038 62.2111 60.7524 64.0244 60.7524H68.7174C70.5307 60.7524 72 59.2838 72 57.4714V47.2429C72 45.4305 70.5307 44 68.7174 44H68.7186Z"
      fill="#121312"
    />
    <path
      d="M28.6406 31.9308C28.6406 30.1162 30.1104 28.6458 31.9243 28.6458H56.0712C57.8851 28.6458 59.3548 27.1754 59.3548 25.3608V19.285C59.3548 17.4704 57.8851 16 56.0712 16H30.5245C28.7107 16 27.2409 17.4704 27.2409 19.285V23.9666C27.2409 25.7813 25.7711 27.2516 23.9572 27.2516H19.2837C17.4698 27.2516 16 28.722 16 30.5366V40.7888C16 42.6034 17.4759 44 19.2898 44H25.3631C27.177 44 28.6468 42.5296 28.6468 40.715L28.6406 31.932V31.9308Z"
      fill="#121312"
    />
    <path
      d="M41.1004 37.6774H46.8995C48.7894 37.6774 50.3226 39.2117 50.3226 41.1004V46.8995C50.3226 48.7894 48.7882 50.3225 46.8995 50.3225H41.1004C39.2106 50.3225 37.6774 48.7882 37.6774 46.8995V41.1004C37.6774 39.2105 39.2118 37.6774 41.1004 37.6774V37.6774Z"
      fill="#121312"
    />
  </svg>
);

export const Frontier = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: '#CC703C' }}
  >
    <path
      d="M63.6429 20L63.3645 20.7254L62.4521 23.0445L61.8461 24.5395C57.2427 35.7491 53.6629 41.0688 49.8557 41.0688C48.8938 41.0936 47.9371 40.9212 47.0465 40.5625C46.156 40.2038 45.3512 39.6667 44.6834 38.9852L44.1979 38.5518C42.9885 37.4538 42.4799 37.1831 41.3154 37.1832C40.7094 37.1832 39.6238 37.9435 38.2521 39.7303C36.4147 42.2912 34.8522 45.0327 33.59 47.9106L33.4353 48.2482L49.7645 48.2483L47.7312 52.4075H32.4845L32.4843 69.44L28 69.44L28.0001 20L63.6429 20ZM57.2889 24.1518L32.4843 24.1518L32.4843 40.6262C35.4564 35.5545 38.2816 33.0086 41.32 33.0086C42.3421 32.9765 43.3595 33.1534 44.3082 33.5284C45.2569 33.9034 46.1159 34.468 46.8311 35.1865L47.3323 35.6335C48.4611 36.6585 48.8956 36.8941 49.8604 36.8941C50.9211 36.8957 53.7433 32.4855 57.2889 24.1518Z"
      fill="white"
    />
  </svg>
);

export const Zerion = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      background: 'linear-gradient(120.22deg, #2962EF 0%, #255CE5 100%)',
    }}
  >
    <path
      d="M19.0864 22C17.5783 22 16.9973 23.8648 18.2628 24.6438L49.9199 43.732C50.709 44.2178 51.7614 44.0258 52.3048 43.2969L66.2236 25.024C67.17 23.7545 66.2138 22 64.5757 22H19.0864Z"
      fill="white"
    />
    <path
      d="M68.8425 66C70.3503 66 70.9466 64.1252 69.6814 63.3464L38.015 44.2605C37.2259 43.7748 36.1989 43.991 35.6558 44.7198L21.7099 62.9891C20.7639 64.2582 21.7499 66 23.3877 66H68.8425Z"
      fill="white"
    />
  </svg>
);

export const Phantom = () => (
  <svg
    width="128"
    height="128"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_51_1414)">
      <circle cx="64" cy="64" r="64" fill="url(#paint0_linear_51_1414)" />
      <g filter="url(#filter0_d_51_1414)">
        <path
          d="M110.584 64.9142H99.1422C99.1422 41.7651 80.1732 23 56.7725 23C33.6614 23 14.8718 41.3057 14.412 64.0583C13.9362 87.577 36.2412 108 60.0188 108H63.0096C83.9725 108 112.069 91.7667 116.459 71.9874C117.27 68.3413 114.359 64.9142 110.584 64.9142ZM39.769 65.9454C39.769 69.0411 37.2097 71.5729 34.0804 71.5729C30.9511 71.5729 28.3917 69.0399 28.3917 65.9454V56.8414C28.3917 53.7457 30.9511 51.2139 34.0804 51.2139C37.2097 51.2139 39.769 53.7457 39.769 56.8414V65.9454ZM59.5226 65.9454C59.5226 69.0411 56.9633 71.5729 53.834 71.5729C50.7046 71.5729 48.1453 69.0399 48.1453 65.9454V56.8414C48.1453 53.7457 50.7058 51.2139 53.834 51.2139C56.9633 51.2139 59.5226 53.7457 59.5226 56.8414V65.9454Z"
          fill="url(#paint1_linear_51_1414)"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_51_1414"
        x="6.76403"
        y="15.3596"
        width="117.472"
        height="100.281"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="3.82022" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_51_1414"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_51_1414"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_51_1414"
        x1="64"
        y1="0"
        x2="64"
        y2="128"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#534BB1" />
        <stop offset="1" stop-color="#551BF9" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_51_1414"
        x1="65.5"
        y1="23"
        x2="65.5"
        y2="108"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0.82" />
      </linearGradient>
      <clipPath id="clip0_51_1414">
        <rect width="128" height="128" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export const PlaceHolder = () => {
  return <div style={{ width: 80, height: 80, background: '#555' }}></div>;
};

export const OtherWallets = ({ ...props }) => {
  const column: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };
  const row: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    gap: 2,
  };
  const cell: React.CSSProperties = {
    width: '50%',
    overflow: 'hidden',
    borderRadius: '27.5%',
  };
  return (
    <div style={column} {...props}>
      <div style={row}>
        <div style={cell}>
          <WalletConnect background />
        </div>
        <div style={cell}>
          <Zerion />
        </div>
      </div>
      <div style={row}>
        <div style={cell}>
          <Rainbow />
        </div>
        <div style={cell}>
          <ImToken />
        </div>
      </div>
    </div>
  );
};

export default {
  Injected,
  OtherWallets,
  WalletConnect,
  WalletConnectLegacy,
  MetaMask,
  Coinbase,
  Trust,
  Argent,
  ImToken,
  Rainbow,
  Crypto,
  Ledger,
  Brave,
  Steak,
  Unstoppable,
  ONTO,
  Slope,
  GnosisSafe,
  Frontier,
  Zerion,
  Phantom,
  PlaceHolder,
};
