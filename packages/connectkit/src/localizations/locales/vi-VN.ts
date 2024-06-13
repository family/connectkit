import { LocaleProps } from './';

const viVN: LocaleProps = {
  connectWallet: 'Kết nối ví',
  disconnect: 'Ngắt kết nối',
  connected: 'Đã kết nối',
  wrongNetwork: 'Mạng không hỗ trợ',
  switchNetworks: 'Đổi mạng',
  chainNetwork: 'Mạng {{ CHAIN }}',
  copyToClipboard: 'Sao chép',
  copyCode: 'Sao chép mã',
  moreInformation: 'Thêm thông tin',
  back: 'Quay lại',
  close: 'Đóng',
  or: 'hoặc',
  more: 'Thêm',
  tryAgain: 'Thử lại',
  tryAgainQuestion: 'Thử lại?',
  dontHaveTheApp: 'Không có app?',
  scanTheQRCode: 'Quét mã QR',
  useWalletConnectModal: 'Dùng WalletConnect Modal',
  useModal: 'Dùng Modal',
  installTheExtension: 'Cài tiện ích',
  getWalletName: 'Lấy {{ CONNECTORNAME }}',
  otherWallets: 'Các ví khác',
  learnMore: 'Xem thêm',
  getWallet: 'Tạo một ví',
  approveInWallet: 'Cấp quyền trong ví',
  confirmInWallet: 'Xác nhận trong ví',
  awaitingConfirmation: 'Đang chờ xác nhận',
  signIn: 'Đăng nhập',
  signOut: 'Đăng xuất',
  signedIn: 'Đã đăng nhập',
  signedOut: 'Đã đăng xuất',
  walletNotConnected: 'Chưa kết nối ví',

  warnings_walletSwitchingUnsupported: `Ví của bạn không hỗ trợ đổi mạng từ ứng dụng.`,
  warnings_walletSwitchingUnsupportedResolve: `Hãy thử đổi mạng từ phía ví của bạn.`,
  warnings_chainUnsupported: `Ứng dụng này không hỗ trợ mạng hiện tại.`,
  warnings_chainUnsupportedResolve: `Đổi hoặc ngắt kết nối để tiếp tục.`,

  onboardingScreen_heading: `Tạo một ví`,
  onboardingScreen_h1: `Bắt đầu khám khá Web3`,
  onboardingScreen_p: `Ví của bạn là cổng giao tiếp mọi thứ trên Ethereum, công nghệ tuyệt vời giúp khám phá Web3.`,
  onboardingScreen_ctaText: `Chọn ví đầu tiên của bạn`,
  onboardingScreen_ctaUrl: `https://ethereum.org/en/wallets/find-wallet/`,

  aboutScreen_heading: `Giới thiệu các ví`,
  aboutScreen_a_h1: `Cho tài sản số của bạn`,
  aboutScreen_a_p: `Các ví để bạn gửi, nhận, lưu trữ, và tương tác với các tài sản điện tử như NFTs và các loại tiền Ethereum khác.`,
  aboutScreen_b_h1: `Một cách tốt hơn để đăng nhập`,
  aboutScreen_b_p: `Với các ứng dụng hiện đại, ví của bạn có thể dùng để đăng nhập dễ dàng thay vì phải nhớ tài khoản và mật khẩu.`,
  aboutScreen_c_h1: `Khám phá thế giới Web3`,
  aboutScreen_c_p: `Ví của bạn là một tiện ích thiết yếu cho phép bạn khám phá và tham gia vào thế giới web3 đang phát triển nhanh chóng.`,
  aboutScreen_ctaText: `Tìm hiểu thêm`,
  aboutScreen_ctaUrl: `https://ethereum.org/en/wallets/`,

  connectorsScreen_heading: `Kết nối Ví`,
  connectorsScreen_newcomer: `Tôi chưa có ví`,
  connectorsScreen_h1: `Ví là gì?`,
  connectorsScreen_p: `Ví dùng để gửi, nhận, và lưu trữ các tài sản điện tử. Kết nối với một ví giúp bạn tương tác với các ứng dụng.`,

  mobileConnectorsScreen_heading: `Chọn ví`,

  scanScreen_heading: `Scan bằng điện thoại`,
  scanScreen_heading_withConnector: `Quét với {{ CONNECTORNAME }}`,
  scanScreen_tooltip_walletConnect: `Mở một [WALLETCONNECTLOGO] mà WalletConnect \n hỗ trợ để quét`,
  scanScreen_tooltip_default: `Mở {{ CONNECTORNAME }} trong \nđiện thoại của bạn để quét`,

  downloadAppScreen_heading: `Lấy {{ CONNECTORNAME }}`,
  downloadAppScreen_iosAndroid: `Quét bằng camera trên điện thoại của bạn để tải về cho iOS hoặc Android.`,
  downloadAppScreen_ios: `Quét bằng camera trên điện thoại ủa bạn để tải về cho iOS.`,
  downloadAppScreen_android: `Quét bằng camera trên điện thoại ủa bạn để tải về cho Android.`,

  injectionScreen_unavailable_h1: `Trình duyệt không được hỗ trợ`,
  injectionScreen_unavailable_p: `Để kết nối ví {{ CONNECTORSHORTNAME }} của bạn,\ncài đặt tiện ích trên {{ SUGGESTEDEXTENSIONBROWSER }}.`,

  injectionScreen_install_h1: `Cài {{ CONNECTORNAME }}`,
  injectionScreen_install_p: `Để kết nối ví {{ CONNECTORSHORTNAME }},\ncài đặt tiện ích trên trình duyệt.`,

  injectionScreen_connecting_h1: `Đang yêu cầu kết nối`,
  injectionScreen_connecting_p: `Mở tiện ích {{ CONNECTORSHORTNAME }} \n trên trình duyệt để kết nối.`,
  injectionScreen_connecting_injected_h1: `Đang yêu cầu kết nối`,
  injectionScreen_connecting_injected_p: `Đồng ý yêu cầu từ phía ví của bạn để kết nối ứng dụng này.`,

  injectionScreen_connected_h1: `Đã kết nối`,
  injectionScreen_connected_p: `Đã có thể đóng popup`,

  injectionScreen_rejected_h1: `Đã hủy yêu cầu`,
  injectionScreen_rejected_p: `Bạn vừa hủy yêu cầu.\nNhấn phía trên để thử lại.`,

  injectionScreen_failed_h1: `Kết nối không thành công`,
  injectionScreen_failed_p: `Xin lỗi, có gì đó không đúng.\nVui lòng thử lại.`,

  injectionScreen_notconnected_h1: `Đăng nhập vào {{ CONNECTORNAME }}`,
  injectionScreen_notconnected_p: `Để tiếp tục, vui lòng đăng nhập bằng tiện ích {{ CONNECTORNAME }}.`,

  profileScreen_heading: 'Đã kết nối',

  switchNetworkScreen_heading: 'Đổi mạng',

  signInWithEthereumScreen_tooltip:
    'Bạn chưa đăng nhập vào ứng dụng.\n**Đăng nhập qua Ethereum** để tiếp tục.',

  signInWithEthereumScreen_signedOut_heading: 'Đăng nhập qua Ethereum',
  signInWithEthereumScreen_signedOut_h1:
    'Ứng dụng này muốn xác nhận bạn \n là chủ sở hữu của ví.',
  signInWithEthereumScreen_signedOut_p: `Vui lòng ký tin nhắn yêu cầu \n trên ví của bạn để tiếp tục.`,
  signInWithEthereumScreen_signedOut_button: 'Đăng nhập',

  signInWithEthereumScreen_signedIn_heading: 'Đăng nhập qua Ethereum',
  signInWithEthereumScreen_signedIn_h1: 'Bạn đã xác nhận thành công.',
  signInWithEthereumScreen_signedIn_p: `Sau khi Đăng xuất bạn sẽ cần \n xác nhận lại trong làn tiếp theo.`,
  signInWithEthereumScreen_signedIn_button: 'Đăng xuất',
};

export default viVN;
