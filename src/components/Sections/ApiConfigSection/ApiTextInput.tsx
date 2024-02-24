import { useApiState, ApiUrlState } from '../../../store/store';
import InputCard from '../../inputs/InputCard';
import { produce } from 'immer';
import React from 'react';

function changeFunction(id: keyof ApiUrlState) {
  return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    useApiState.setState(
      produce((state: ApiUrlState) => {
        state[id] = e.currentTarget.value || undefined;
      })
    );
    e.preventDefault();
  }
}

export interface ApiTextInputProps {
  propName: keyof ApiUrlState,
  dispName: string,
}

export function ApiTextInput(props: ApiTextInputProps) {
  return <InputCard title={props.dispName} required={false} hasValue={false}>
    <textarea
      className="focus:shadow-outline w-full appearance-none break-words break-all rounded border leading-tight text-gray-700 shadow focus:outline-none dark:bg-gray-700 dark:text-white"
      onChange={changeFunction(props.propName)}
      value={useApiState(state => state[props.propName])}
    />
  </InputCard>
}
