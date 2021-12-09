import React from 'react';

export const Field: React.FC<{ label: string }> = (props) => (
  <label className="block flex flex-col space-y-3">
    <span className="text-3xl font-light">{props.label}</span>
    {props.children}
  </label>
);
