import React from 'react';

export const Field: React.FC<{ label: string; required?: boolean }> = (props) => (
  <label className="block flex flex-col space-y-3">
    <span className="text-3xl font-light">
      {props.label}
      {props.required ? (
        <span className="text-red-500" title="Field is required">
          *
        </span>
      ) : null}
    </span>
    {props.children}
  </label>
);
