import { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { RowTreeFormValues, RowTreeNodeBody } from '../types';
import styles from './OutlayListEditItem.module.scss';
import { Input } from '~/ui/Input';
import { getUUID } from '~/utils/getUUID';
import { Portal } from '~/ui/Portal';
import { getFormikFieldData } from '~/utils/getFormikFieldData';

interface OutlayListEditItemProps {
  itemBody: RowTreeNodeBody;
  onSubmit: (id: string, values: RowTreeFormValues) => void;
  disabled: boolean;
  onEditCancel: () => void;
}

const VALIDATION_IS_EMPTY_MSG = 'не заполнено';
const VALIDATION_IS_NOT_STRING = 'не строка';
const VALIDATION_IS_NOT_NUMBER = 'не число';
const VALIDATION_IS_NOT_INTEGER = 'не целое число';
const VALIDATION_VERY_BIG_NUMBER = 'слишком большое число';
const VALIDATION_MAX_NUMBER = 999999999999999;

const integerValidator = (n: number | undefined): boolean =>
  typeof n === 'number' && new RegExp('^[0-9]+$').test(n.toString());

const validationSchema: yup.ObjectSchema<RowTreeFormValues> = yup.object({
  name: yup.string().typeError(VALIDATION_IS_NOT_STRING).required(VALIDATION_IS_EMPTY_MSG),
  count: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .test('isInteger', VALIDATION_IS_NOT_INTEGER, integerValidator)
    .required(VALIDATION_IS_EMPTY_MSG),
  sum: yup
    .number()
    .typeError(VALIDATION_IS_NOT_NUMBER)
    .max(VALIDATION_MAX_NUMBER, VALIDATION_VERY_BIG_NUMBER)
    .required(VALIDATION_IS_EMPTY_MSG),
});

export function OutlayListEditItem({ itemBody, onSubmit, disabled, onEditCancel }: OutlayListEditItemProps) {
  const FORM_ID = useMemo(() => `form_${getUUID()}`, []);

  const { id, ...initialValues } = itemBody;

  const formik = useFormik<RowTreeFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: ({ sum, name, count }) => {
      onSubmit(id, { name, count: +count, sum: +sum });
    },
  });

  const nameFieldData = getFormikFieldData(formik, 'name');
  const countFieldData = getFormikFieldData(formik, 'count');
  const sumFieldData = getFormikFieldData(formik, 'sum');

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      // console.log(e);
      if (e.code === 'Escape') {
        onEditCancel();
      }
    };

    window.addEventListener('keyup', cb);

    return () => {
      window.removeEventListener('keyup', cb);
    };
  }, [onEditCancel]);

  return (
    <>
      <Portal>
        <form noValidate autoComplete={'off'} id={FORM_ID} onSubmit={formik.handleSubmit} className={styles.form}>
          <button form={FORM_ID} type={'submit'} disabled={disabled}>
            submit
          </button>
        </form>
      </Portal>
      <td>
        <span className={styles.field}>
          <Input form={FORM_ID} {...nameFieldData.fieldProps} autoFocus={true} />
          {nameFieldData.isError && <span className={styles.error}>{nameFieldData.errorText}</span>}
        </span>
      </td>
      <td>
        <span className={styles.field}>
          <Input form={FORM_ID} {...countFieldData.fieldProps} />
          {countFieldData.isError && <span className={styles.error}>{countFieldData.errorText}</span>}
        </span>
      </td>
      <td>
        <span className={styles.field}>
          <Input form={FORM_ID} {...sumFieldData.fieldProps} />
          {sumFieldData.isError && <span className={styles.error}>{sumFieldData.errorText}</span>}
        </span>
      </td>
    </>
  );
}
