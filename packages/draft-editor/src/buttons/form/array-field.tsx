import React from 'react'
import { AlertDialog } from '@keystone-ui/modals';
import { Button } from '@keystone-ui/button'
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { PlusCircleIcon } from '@keystone-ui/icons/icons/PlusCircleIcon';
import { Stack } from '@keystone-ui/core'

type ArrayFieldProps = {
  label?: string
}

export const ArrayField: React.FC<ArrayFieldProps> = function({label}) {
  return (
    <Stack gap="medium">
      {label && <FieldLabel>{label}</FieldLabel>}
      <TextInput />
      <TextInput />
      {/*
      <OrderableList {...props}>
        {props.elements.map(val => {
          return (
            <OrderableItemInForm
              elementKey={val.key}
              label={props.schema.itemLabel?.(val) ?? 'Item'}
              {...val}
            />
          );
        })}
      </OrderableList>
      */}
      <Button
        onClick={() => {
          //props.onChange([...props.elements.map(x => ({ key: x.key })), { key: undefined }]);
        }}
        tone="active"
      >
        <Stack gap="small" across>
          <PlusCircleIcon size="smallish" /> <span>Add</span>
        </Stack>
      </Button>
    </Stack>
  );
}

