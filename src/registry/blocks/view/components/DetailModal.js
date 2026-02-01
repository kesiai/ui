import React from 'react'
import _ from 'lodash'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
 } from 'xui'
import { C } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'

const DetailModal = ({ id, children }) => {
  const [show, setShow] = React.useState(false)

  const showModal = () => {
    setShow(true)
  }

  return (
    <>
      <a className="cursor-pointer" onClick={showModal}>
        {children}
      </a>
      {show && (
        <Dialog open={show} onOpenChange={setShow}>
          <DialogContent className="sm:max-w-4xl w-5/6 max-h-full overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{children}</DialogTitle>
            </DialogHeader>
            <C is="Model.DataDetail" id={id} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default DetailModal
