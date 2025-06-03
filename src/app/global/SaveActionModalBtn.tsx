import React from 'react'
import { FloppyDiskSvg } from './FloppyDiskSvg';

export const SaveActionModalBtn = ({onClick}: any) => {
  return (
    <button className="save-action-modal-btn" onClick={onClick}>
      <FloppyDiskSvg width={24} height={24} />
      Guardar
    </button>
  );
}
