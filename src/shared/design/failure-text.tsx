import React from 'react';

export const FailureText = (props: { text?: string | React.ReactElement | null | undefined }) => (
  <div className="font-medium text-2xl text-red-500">{props.text ?? <>&nbsp;</>}</div>
);
