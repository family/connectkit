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
  >
    {background && (
      <path d="M32 0H0V32H32V0Z" fill={'var(--brand-walletConnect)'} />
    )}
    <path
      d="M9.58818 11.8556C13.1293 8.31442 18.8706 8.31442 22.4117 11.8556L22.8379 12.2818C23.015 12.4588 23.015 12.7459 22.8379 12.9229L21.3801 14.3808C21.2915 14.4693 21.148 14.4693 21.0595 14.3808L20.473 13.7943C18.0026 11.3239 13.9973 11.3239 11.5269 13.7943L10.8989 14.4223C10.8104 14.5109 10.6668 14.5109 10.5783 14.4223L9.12041 12.9645C8.94336 12.7875 8.94336 12.5004 9.12041 12.3234L9.58818 11.8556ZM25.4268 14.8706L26.7243 16.1682C26.9013 16.3452 26.9013 16.6323 26.7243 16.8093L20.8737 22.6599C20.6966 22.8371 20.4096 22.8371 20.2325 22.6599L16.0802 18.5076C16.0359 18.4634 15.9641 18.4634 15.9199 18.5076L11.7675 22.6599C11.5905 22.8371 11.3034 22.8371 11.1264 22.66C11.1264 22.66 11.1264 22.6599 11.1264 22.6599L5.27561 16.8092C5.09856 16.6322 5.09856 16.3451 5.27561 16.168L6.57313 14.8706C6.75019 14.6934 7.03726 14.6934 7.21431 14.8706L11.3668 19.023C11.411 19.0672 11.4828 19.0672 11.5271 19.023L15.6793 14.8706C15.8563 14.6934 16.1434 14.6934 16.3205 14.8706L20.473 19.023C20.5172 19.0672 20.589 19.0672 20.6332 19.023L24.7856 14.8706C24.9627 14.6935 25.2498 14.6935 25.4268 14.8706Z"
      fill={background ? 'white' : 'var(--brand-walletConnect)'}
    />
  </svg>
);
/*
export const WalletConnectQRCode = ({ ...props }) => (
  <svg
    {...props}
    width="76"
    height="54"
    viewBox="0 0 76 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51 0H21V5H15V9H11V14H5V20H0V39H5V40H11V44H16V49H21V54H27H30H35V49H41V54H46H50H55V50H60V44H65V39H66H70H76V20H70V14H66V9H61V5H55V0H51ZM24 39V40H26V39H24ZM51 38H50V40H51V38Z"
      fill="var(--body-background)"
    />
    <path
      d="M20.5813 16.0338C29.807 6.65539 44.7645 6.65539 53.9901 16.0338L55.1004 17.1625C55.5619 17.6313 55.5619 18.3917 55.1004 18.8605L51.3024 22.7217C51.0716 22.956 50.6977 22.956 50.4672 22.7217L48.9392 21.1684C42.5031 14.6258 32.0684 14.6258 25.6323 21.1684L23.9961 22.8316C23.7654 23.0662 23.3915 23.0662 23.1609 22.8316L19.3627 18.9707C18.9014 18.5018 18.9014 17.7415 19.3627 17.2727L20.5813 16.0338ZM61.8452 24.0187L65.2255 27.4553C65.6867 27.9241 65.6867 28.6844 65.2255 29.1533L49.9831 44.6481C49.5219 45.1172 48.7739 45.1172 48.3127 44.6481L37.4948 33.651C37.3792 33.5339 37.1923 33.5339 37.077 33.651L26.2591 44.6481C25.7979 45.1172 25.05 45.1172 24.5888 44.6484C24.5887 44.6484 24.5887 44.6481 24.5887 44.6481L9.34595 29.153C8.88468 28.6841 8.88468 27.9238 9.34595 27.455L12.7263 24.0187C13.1876 23.5495 13.9355 23.5495 14.3968 24.0187L25.215 35.0161C25.3303 35.1332 25.5174 35.1332 25.6326 35.0161L36.4503 24.0187C36.9115 23.5495 37.6594 23.5495 38.1209 24.0187L48.9392 35.0161C49.0544 35.1332 49.2414 35.1332 49.3566 35.0161L60.1746 24.0187C60.6361 23.5498 61.384 23.5498 61.8452 24.0187Z"
      fill="var(--brand-walletConnect)"
    />
  </svg>
);
*/
export const MetaMask = ({ background = false, ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    style={
      background
        ? {
            background:
              'linear-gradient(0deg, var(--brand-metamask-12), var(--brand-metamask-11))',
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
        <stop offset="0.130682" stopColor="var(--brand-metamask-11)" />
        <stop offset="1" stopColor="var(--brand-metamask-12)" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" fill="url(#paint0_linear_967_843)" />
     */}
    <path
      d="M27.2684 4.03027L17.5018 11.2841L19.3079 7.00442L27.2684 4.03027Z"
      fill="var(--brand-metamask-02)"
      stroke="var(--brand-metamask-02)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.7218 4.03027L14.4099 11.3528L12.6921 7.00442L4.7218 4.03027Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.7544 20.8438L21.1532 24.8289L26.7187 26.3602L28.3187 20.9321L23.7544 20.8438Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.69104 20.9321L5.28117 26.3602L10.8467 24.8289L8.24551 20.8438L3.69104 20.9321Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5327 14.1108L8.98181 16.4568L14.5081 16.7022L14.3117 10.7637L10.5327 14.1108Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.4576 14.1111L17.6295 10.6953L17.5018 16.7025L23.0182 16.4571L21.4576 14.1111Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8469 24.8292L14.1647 23.2096L11.2984 20.9717L10.8469 24.8292Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.8257 23.2096L21.1531 24.8292L20.6918 20.9717L17.8257 23.2096Z"
      fill="var(--brand-metamask-08)"
      stroke="var(--brand-metamask-08)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.1531 24.8296L17.8257 23.21L18.0906 25.3793L18.0612 26.2921L21.1531 24.8296Z"
      fill="var(--brand-metamask-06)"
      stroke="var(--brand-metamask-06)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8469 24.8296L13.9388 26.2921L13.9192 25.3793L14.1647 23.21L10.8469 24.8296Z"
      fill="var(--brand-metamask-06)"
      stroke="var(--brand-metamask-06)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.9877 19.5389L11.2196 18.7242L13.1729 17.8311L13.9877 19.5389Z"
      fill="var(--brand-metamask-09)"
      stroke="var(--brand-metamask-09)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0023 19.5389L18.8171 17.8311L20.7802 18.7242L18.0023 19.5389Z"
      fill="var(--brand-metamask-09)"
      stroke="var(--brand-metamask-09)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8468 24.8289L11.3179 20.8438L8.24561 20.9321L10.8468 24.8289Z"
      fill="var(--brand-metamask-03)"
      stroke="var(--brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.6821 20.8438L21.1532 24.8289L23.7544 20.9321L20.6821 20.8438Z"
      fill="var(--brand-metamask-03)"
      stroke="var(--brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.0182 16.4565L17.5018 16.7019L18.0122 19.5387L18.827 17.8308L20.7902 18.7239L23.0182 16.4565Z"
      fill="var(--brand-metamask-03)"
      stroke="var(--brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2198 18.7239L13.1829 17.8308L13.9878 19.5387L14.5081 16.7019L8.98181 16.4565L11.2198 18.7239Z"
      fill="var(--brand-metamask-03)"
      stroke="var(--brand-metamask-03)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.98181 16.4565L11.2983 20.9718L11.2198 18.7239L8.98181 16.4565Z"
      fill="var(--brand-metamask-10)"
      stroke="var(--brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.7901 18.7239L20.6919 20.9718L23.0181 16.4565L20.7901 18.7239Z"
      fill="var(--brand-metamask-10)"
      stroke="var(--brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.508 16.7021L13.9878 19.5389L14.6356 22.886L14.7828 18.4788L14.508 16.7021Z"
      fill="var(--brand-metamask-10)"
      stroke="var(--brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5017 16.7021L17.2367 18.4689L17.3545 22.886L18.0121 19.5389L17.5017 16.7021Z"
      fill="var(--brand-metamask-10)"
      stroke="var(--brand-metamask-10)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0121 19.5388L17.3545 22.886L17.8257 23.2099L20.6918 20.972L20.79 18.7241L18.0121 19.5388Z"
      fill="var(--brand-metamask-01)"
      stroke="var(--brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2196 18.7241L11.2981 20.972L14.1644 23.2099L14.6355 22.886L13.9877 19.5388L11.2196 18.7241Z"
      fill="var(--brand-metamask-01)"
      stroke="var(--brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0615 26.2917L18.0908 25.3788L17.8455 25.1628H14.145L13.9192 25.3788L13.9388 26.2917L10.8469 24.8291L11.9267 25.7126L14.1155 27.234H17.875L20.0736 25.7126L21.1533 24.8291L18.0615 26.2917Z"
      fill="var(--brand-metamask-07)"
      stroke="var(--brand-metamask-07)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.8258 23.2096L17.3546 22.8857H14.6357L14.1646 23.2096L13.9191 25.379L14.1449 25.163H17.8454L18.0907 25.379L17.8258 23.2096Z"
      fill="var(--brand-metamask-04)"
      stroke="var(--brand-metamask-04)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.6806 11.7552L28.5149 7.75041L27.2683 4.03027L17.8257 11.0387L21.4575 14.1109L26.591 15.6128L27.7296 14.2876L27.2389 13.9342L28.0241 13.2178L27.4156 12.7465L28.2007 12.1478L27.6806 11.7552Z"
      fill="var(--brand-metamask-05)"
      stroke="var(--brand-metamask-05)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.48486 7.75041L4.3192 11.7552L3.78916 12.1478L4.57441 12.7465L3.97566 13.2178L4.7609 13.9342L4.27012 14.2876L5.39892 15.6128L10.5325 14.1109L14.1644 11.0387L4.72164 4.03027L3.48486 7.75041Z"
      fill="var(--brand-metamask-05)"
      stroke="var(--brand-metamask-05)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.591 15.6122L21.4575 14.1104L23.0181 16.4564L20.6919 20.9716L23.7544 20.9323H28.3186L26.591 15.6122Z"
      fill="var(--brand-metamask-01)"
      stroke="var(--brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5326 14.1104L5.39897 15.6122L3.69104 20.9323H8.24551L11.2982 20.9716L8.98168 16.4564L10.5326 14.1104Z"
      fill="var(--brand-metamask-01)"
      stroke="var(--brand-metamask-01)"
      strokeWidth="0.269931"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5018 16.7018L17.8258 11.0381L19.3177 7.00391H12.6921L14.1645 11.0381L14.5081 16.7018L14.6258 18.4883L14.6356 22.8856H17.3546L17.3742 18.4883L17.5018 16.7018Z"
      fill="var(--brand-metamask-01)"
      stroke="var(--brand-metamask-01)"
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
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill="var(--brand-coinbaseWallet)" />
    {background && (
      <path
        d="M0 12.64C0 8.31047 0 6.1457 0.815779 4.48049C1.59686 2.88611 2.88611 1.59686 4.48049 0.815779C6.1457 0 8.31047 0 12.64 0H19.36C23.6895 0 25.8543 0 27.5195 0.815779C29.1139 1.59686 30.4031 2.88611 31.1842 4.48049C32 6.1457 32 8.31047 32 12.64V19.36C32 23.6895 32 25.8543 31.1842 27.5195C30.4031 29.1139 29.1139 30.4031 27.5195 31.1842C25.8543 32 23.6895 32 19.36 32H12.64C8.31047 32 6.1457 32 4.48049 31.1842C2.88611 30.4031 1.59686 29.1139 0.815779 27.5195C0 25.8543 0 23.6895 0 19.36V12.64Z"
        fill="var(--brand-coinbaseWallet)"
      />
    )}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.0003 27.1999C22.1859 27.1999 27.2003 22.1855 27.2003 15.9999C27.2003 9.81434 22.1859 4.79993 16.0003 4.79993C9.8147 4.79993 4.80029 9.81434 4.80029 15.9999C4.80029 22.1855 9.8147 27.1999 16.0003 27.1999ZM13.2003 12.3428C12.7269 12.3428 12.3432 12.7266 12.3432 13.1999V18.7999C12.3432 19.2733 12.7269 19.6571 13.2003 19.6571H18.8003C19.2737 19.6571 19.6574 19.2733 19.6574 18.7999V13.1999C19.6574 12.7266 19.2737 12.3428 18.8003 12.3428H13.2003Z"
      fill="white"
    />
  </svg>
);

export const Trust = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="44" height="44" fill="var(--brand-trust-02)" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.0246 11.8662C33.4096 11.8662 33.774 12.0243 34.0421 12.2925C34.3102 12.5675 34.4615 12.9387 34.4546 13.3168C34.3859 17.4143 34.2277 20.5493 33.9321 23.0312C33.6433 25.5131 33.2102 27.3556 32.5571 28.8475C32.1171 29.8443 31.574 30.6693 30.9346 31.3706C30.0752 32.2987 29.0921 32.9725 28.0196 33.6119C27.561 33.8861 27.0843 34.1568 26.5842 34.4408C25.5172 35.0468 24.3441 35.713 23.0146 36.6025C22.5333 36.9256 21.9077 36.9256 21.4265 36.6025C20.0766 35.7026 18.8879 35.0281 17.8112 34.4173C17.5718 34.2815 17.3379 34.1488 17.109 34.0175C15.8509 33.2887 14.7165 32.5943 13.7265 31.5906C13.0665 30.9306 12.4959 30.1262 12.0421 29.1706C11.4234 27.8918 11.004 26.345 10.6946 24.3443C10.2821 21.67 10.0759 18.1706 10.0002 13.3168C9.99336 12.9387 10.1377 12.5675 10.4059 12.2925C10.674 12.0243 11.0452 11.8662 11.4302 11.8662H12.0215C13.8433 11.8731 17.8652 11.6943 21.344 8.98559C21.8596 8.58683 22.5815 8.58683 23.0971 8.98559C26.5759 11.6943 30.5977 11.8731 32.4265 11.8662H33.0246ZM29.8277 27.9331C30.2746 27.0118 30.6459 25.74 30.9277 23.9112C31.2646 21.725 31.4709 18.755 31.5671 14.7125C29.4221 14.6506 25.7371 14.2381 22.224 11.8731C18.7109 14.2312 15.0259 14.6437 12.8877 14.7125C12.9633 18.0537 13.1146 20.6525 13.3552 22.6943C13.6302 25.0181 14.0221 26.5925 14.5102 27.6993C14.8333 28.435 15.1909 28.9643 15.6171 29.4318C16.1877 30.0575 16.9096 30.5731 17.8927 31.1643C18.3005 31.409 18.7502 31.6635 19.2396 31.9406C20.1116 32.4341 21.1099 32.9991 22.224 33.7081C23.3175 33.0107 24.3014 32.4515 25.1633 31.9616C25.4231 31.8139 25.6717 31.6725 25.909 31.5356C27.119 30.8412 28.0127 30.2637 28.6796 29.59C29.1265 29.1293 29.4909 28.6275 29.8277 27.9331Z"
      fill="var(--brand-trust-01)"
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
      fill="var(--brand-argent)"
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
      var(--brand-imtoken-01) 0%,
      var(--brand-imtoken-02) 100%
    )`,
    }}
  >
    <path
      d="M26.8543 9.96509C27.5498 19.3857 21.4942 23.8384 16.0655 24.3132C11.0184 24.7546 6.26765 21.6534 5.85087 16.8885C5.50707 12.952 7.94004 11.2761 9.8516 11.109C11.8177 10.9367 13.4698 12.2925 13.6132 13.9342C13.7512 15.5125 12.7664 16.2308 12.0815 16.2906C11.5398 16.3381 10.8584 16.0093 10.7968 15.3032C10.7441 14.6965 10.9744 14.6138 10.9182 13.9693C10.8179 12.8219 9.81731 12.6882 9.26951 12.7357C8.60654 12.7937 7.40368 13.5675 7.5725 15.4949C7.7422 17.439 9.60628 18.9751 12.0498 18.7614C14.6868 18.531 16.5227 16.4779 16.6608 13.5983C16.6595 13.4458 16.6916 13.2948 16.7548 13.156L16.7557 13.1525C16.7841 13.0922 16.8174 13.0342 16.8551 12.9793C16.9113 12.8949 16.9835 12.8016 17.0767 12.6997C17.0775 12.697 17.0775 12.697 17.0793 12.697C17.147 12.6205 17.2288 12.5379 17.3211 12.4491C18.473 11.3623 22.6214 8.79916 26.5448 9.61074C26.6277 9.62851 26.7026 9.67262 26.7584 9.73649C26.8142 9.80035 26.8478 9.88054 26.8543 9.96509"
      fill="white"
    />
  </svg>
);

export const Rainbow = ({ ...props }) => (
  // Here we're using a base64 of an svg because the gradients in this logo do not play nicely on mobile devices
  <svg
    {...props}
    aria-hidden="true"
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      background: `linear-gradient(
      180deg,
      #174299 0%,
      #001E59 100%
    )`,
      backgroundSize: '100% 100%',
      backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzhIMjZDNTYuOTI3OSAzOCA4MiA2My4wNzIxIDgyIDk0VjEwMEg5NEM5Ny4zMTM3IDEwMCAxMDAgOTcuMzEzNyAxMDAgOTRDMTAwIDUzLjEzMDkgNjYuODY5MSAyMCAyNiAyMEMyMi42ODYzIDIwIDIwIDIyLjY4NjMgMjAgMjZWMzhaIiBmaWxsPSJ1cmwoI3BhaW50MV9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNODQgOTRIMTAwQzEwMCA5Ny4zMTM3IDk3LjMxMzcgMTAwIDk0IDEwMEg4NFY5NFoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiAyMEwyNiAzNkgyMEwyMCAyNkMyMCAyMi42ODYzIDIyLjY4NjMgMjAgMjYgMjBaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzZIMjZDNTguMDMyNSAzNiA4NCA2MS45Njc1IDg0IDk0VjEwMEg2NlY5NEM2NiA3MS45MDg2IDQ4LjA5MTQgNTQgMjYgNTRIMjBWMzZaIiBmaWxsPSJ1cmwoI3BhaW50NF9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNNjggOTRIODRWMTAwSDY4Vjk0WiIgZmlsbD0idXJsKCNwYWludDVfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDUyTDIwIDM2TDI2IDM2TDI2IDUySDIwWiIgZmlsbD0idXJsKCNwYWludDZfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDYyQzIwIDY1LjMxMzcgMjIuNjg2MyA2OCAyNiA2OEM0MC4zNTk0IDY4IDUyIDc5LjY0MDYgNTIgOTRDNTIgOTcuMzEzNyA1NC42ODYzIDEwMCA1OCAxMDBINjhWOTRDNjggNzAuODA0IDQ5LjE5NiA1MiAyNiA1MkgyMFY2MloiIGZpbGw9InVybCgjcGFpbnQ3X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik01MiA5NEg2OFYxMDBINThDNTQuNjg2MyAxMDAgNTIgOTcuMzEzNyA1MiA5NFoiIGZpbGw9InVybCgjcGFpbnQ4X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiA2OEMyMi42ODYzIDY4IDIwIDY1LjMxMzcgMjAgNjJMMjAgNTJMMjYgNTJMMjYgNjhaIiBmaWxsPSJ1cmwoI3BhaW50OV9yYWRpYWxfNjJfMzI5KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzYyXzMyOSIgeDE9IjYwIiB5MT0iMCIgeDI9IjYwIiB5Mj0iMTIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxNzQyOTkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxRTU5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQxX3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDc0KSI+CjxzdG9wIG9mZnNldD0iMC43NzAyNzciIHN0b3AtY29sb3I9IiNGRjQwMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODc1NEM5Ii8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl82Ml8zMjkiIHgxPSI4MyIgeTE9Ijk3IiB4Mj0iMTAwIiB5Mj0iOTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDAwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzYyXzMyOSIgeDE9IjIzIiB5MT0iMjAiIHgyPSIyMyIgeTI9IjM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY0MDAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ0X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDU4KSI+CjxzdG9wIG9mZnNldD0iMC43MjM5MjkiIHN0b3AtY29sb3I9IiNGRkY3MDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5OTAxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ1X2xpbmVhcl82Ml8zMjkiIHgxPSI2OCIgeTE9Ijk3IiB4Mj0iODQiIHkyPSI5NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Nl9saW5lYXJfNjJfMzI5IiB4MT0iMjMiIHkxPSI1MiIgeDI9IjIzIiB5Mj0iMzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRjcwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk5MDEiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDdfcmFkaWFsXzYyXzMyOSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyNiA5NCkgcm90YXRlKC05MCkgc2NhbGUoNDIpIj4KPHN0b3Agb2Zmc2V0PSIwLjU5NTEzIiBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50OF9yYWRpYWxfNjJfMzI5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDUxIDk3KSBzY2FsZSgxNyA0NS4zMzMzKSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMEFBRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ5X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMgNjkpIHJvdGF0ZSgtOTApIHNjYWxlKDE3IDMyMi4zNykiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=")`,
    }}
  />
);

export const Brave = ({ ...props }) => (
  <svg
    {...props}
    aria-hidden="true"
    width="2770"
    height="2770"
    viewBox="-100 -100 2970 2970"
    xmlns="http://www.w3.org/2000/svg"
    style={{ background: 'white' }}
  >
    <linearGradient id="braveA" y1="51%" y2="51%">
      <stop offset=".4" stopColor="#f50" />
      <stop offset=".6" stopColor="#ff2000" />
    </linearGradient>
    <linearGradient id="braveB" x1="2%" y1="51%" y2="51%">
      <stop offset="0" stopColor="#ff452a" />
      <stop offset="1" stopColor="#ff2000" />
    </linearGradient>
    <path
      fill="url(#braveA)"
      d="m2395 723 60-147-170-176c-92-92-288-38-288-38l-222-252H992L769 363s-196-53-288 37L311 575l60 147-75 218 250 953c52 204 87 283 234 387l457 310c44 27 98 74 147 74s103-47 147-74l457-310c147-104 182-183 234-387l250-953z"
    />
    <path
      fill="#fff"
      d="M1935 524s287 347 287 420c0 75-36 94-72 133l-215 230c-20 20-63 54-38 113 25 60 60 134 20 210-40 77-110 128-155 120a820 820 0 0 1-190-90c-38-25-160-126-160-165s126-110 150-124c23-16 130-78 132-102s2-30-30-90-88-140-80-192c10-52 100-80 167-105l207-78c16-8 12-15-36-20-48-4-183-22-244-5s-163 43-173 57c-8 14-16 14-7 62l58 315c4 40 12 67-30 77-44 10-117 27-142 27s-99-17-142-27-35-37-30-77c4-40 48-268 57-315 10-48 1-48-7-62-10-14-113-40-174-57-60-17-196 1-244 6-48 4-52 10-36 20l207 77c66 25 158 53 167 105 10 53-47 132-80 192s-32 66-30 90 110 86 132 102c24 15 150 85 150 124s-119 140-159 165a820 820 0 0 1-190 90c-45 8-115-43-156-120-40-76-4-150 20-210 25-60-17-92-38-113l-215-230c-35-37-71-57-71-131s287-420 287-420l273 44c32 0 103-27 168-50 65-20 110-22 110-22s44 0 110 22 136 50 168 50c33 0 275-47 275-47zm-215 1328c18 10 7 32-10 44l-254 198c-20 20-52 50-73 50s-52-30-73-50a13200 13200 0 0 0-255-198c-16-12-27-33-10-44l150-80a870 870 0 0 1 188-73c15 0 110 34 187 73l150 80z"
    />
    <path
      fill="url(#braveB)"
      d="m1999 363-224-253H992L769 363s-196-53-288 37c0 0 260-23 350 123l276 47c32 0 103-27 168-50 65-20 110-22 110-22s44 0 110 22 136 50 168 50c33 0 275-47 275-47 90-146 350-123 350-123-92-92-288-38-288-38"
    />
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
  >
    <rect width="88" height="88" fill="white" />
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
  >
    <path d="M0 0H88V88H0V0Z" fill="black" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M36.6143 13.8286H13.8286V28.2857H17.2857V17.2857L36.6143 17.16V13.8286ZM36.7714 32.5286V55.3143H51.2286V51.8571H40.2286L40.1029 32.5286H36.7714ZM13.8286 74.1714H36.6143V70.84L17.2857 70.7143V59.7143H13.8286V74.1714ZM51.3857 13.8286H74.1714V28.2857H70.7143V17.2857L51.3857 17.16V13.8286ZM74.1714 74.1714H51.3857V70.84L70.7143 70.7143V59.7143H74.1714V74.1714Z"
      fill="white"
    />
  </svg>
);

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
          <Trust />
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
  //WalletConnectQRCode,
  MetaMask,
  Coinbase,
  Trust,
  Argent,
  ImToken,
  Rainbow,
  Crypto,
  Ledger,
  Brave,
};
