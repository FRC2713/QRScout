import React from 'react'
import { InputProps } from './inputs/BaseInputProps'
import InputCard from './inputs/InputCard'
import NumberInput from './inputs/NumberInput'
import SelectInput from './inputs/SelectInput'
import StringInput from './inputs/StringInput'

interface PrematchProps {
  scouter: string
  eventCode: string
  matchLevel: string
  matchNumber: number
  robot: string
  teamNumber: number
  onValueChange: (code: string, data: any) => void
}

export default function Prematch(props: PrematchProps) {
  return (
    <div className="mb-4 rounded bg-white shadow-md">
      <div className="mb-2 rounded-t bg-red-800 p-1 shadow-md">
        <h2 className="text-2xl font-bold uppercase text-white">Prematch</h2>
      </div>
      <InputCard title="Scouter Initials" required>
        <StringInput
          value={props.scouter}
          onChange={(value) => props.onValueChange('scouter', value)}
          type={'text'}
          required={true}
          code={'scouter'}
        />
      </InputCard>
      <InputCard title="Event" required>
        <StringInput
          value={props.eventCode}
          onChange={(value) => props.onValueChange('eventCode', value)}
          type={'text'}
          required={true}
          code={'eventCode'}
        />
      </InputCard>
      <InputCard title="Match Level" required>
        <SelectInput
          value={props.matchLevel}
          onChange={(value) => props.onValueChange('matchLevel', value)}
          type={'text'}
          required={true}
          code={'matchLevel'}
          options={{
            qm: 'Quals',
            ef: 'Eighth Final',
            qf: 'Quarter Final',
            sf: 'Semi Final',
            f: 'Final',
          }}
          defaultValue={'qm'}
        />
      </InputCard>
      <InputCard title="Match Number" required>
        <NumberInput
          value={props.matchNumber}
          onChange={(value) => props.onValueChange('matchNumber', value)}
          type={'number'}
          required={true}
          code={'matchNumber'}
        ></NumberInput>
      </InputCard>
      <InputCard title="Robot" required>
        <SelectInput
          value={props.robot}
          onChange={(value) => props.onValueChange('robot', value)}
          type={'select'}
          required={true}
          code={'robot'}
          options={{
            r1: 'Red 1',
            b1: 'Blue 1',
            r2: 'Red 2',
            b2: 'Blue 2',
            r3: 'Red 3',
            b3: 'Blue 3',
          }}
          defaultValue={'r1'}
        />
      </InputCard>
      <InputCard title="Team Number" required>
        <NumberInput
          value={props.teamNumber}
          onChange={(value) => props.onValueChange('teamNumber', value)}
          type={'number'}
          required={true}
          code={'teamNumber'}
        ></NumberInput>
      </InputCard>
    </div>
  )
}
