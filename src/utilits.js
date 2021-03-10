import React from 'react';
import { Alert, Spin } from 'antd';

export function shortText(longText, maxLength, postfix) {
  const pos = longText.indexOf(' ', maxLength);
  return pos === -1 ? longText : longText.substr(0, pos) + postfix;
}

export const checkOnlineState = () => <Alert message="No internet connection" type="warning" showIcon closable />;

export function spinner() {
  return (
    <div className="example">
      <Spin size="large" />
    </div>
  );
}
