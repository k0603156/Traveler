import React from "react";
import styled from "styled-components";

interface IProps extends React.HTMLAttributes<HTMLInputElement> {
  className?: any;
  required?: boolean;
  entry?: string;
  value: string;
  type?: "password" | "text" | "url" | "email" | "date";
  pattern?: string;
  autoFocus?: boolean;
  minLength?: number;
  maxLength?: number;
}
const InputBox = styled.input`
  border: 1px solid black;
  border-radius: 7px;
  height: 35px;
  width: 100%;
  font-size: 12px;
  padding: 0px 15px;
  margin: 5px 0;
  &[type="date"]::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
  }
  &[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const Input = ({
  className,
  id,
  placeholder,
  required = true,
  entry,
  value,
  onChange,
  type = "text",
  pattern,
  autoFocus = false,
  minLength,
  maxLength
}: IProps) => (
  <InputBox
    className={className}
    id={id}
    placeholder={placeholder}
    required={required}
    data-entry={entry}
    value={value}
    onChange={onChange}
    type={type}
    pattern={pattern}
    autoFocus={autoFocus}
    minLength={minLength}
    maxLength={maxLength}
    autoComplete={"off"}
  />
);

export default Input;