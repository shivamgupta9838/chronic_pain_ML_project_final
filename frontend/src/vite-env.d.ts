/// <reference types="vite/client" />

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      shape?: string;
      text?: string;
      width?: number;
    },
  ) => void;
  cancel?: () => void;
  disableAutoSelect?: () => void;
}

interface Window {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
}
