import React from 'react'
import { CancelSvg } from './CancelSvg';

export const CancelActionModalBtn = ({onClick}: any) => {
  return (
    <button className="cancel-action-modal-btn" onClick={onClick}> 
      <CancelSvg width={24} height={24} />
      Cancelar
    </button>
  );
}
