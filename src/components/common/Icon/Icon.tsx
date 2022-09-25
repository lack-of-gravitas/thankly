export default function Icon({ className = '', ...props }) {
  return (
    <>
      <span
        className={
          className + ` material-symbols-outlined h-6 w-6 `
        }
        aria-hidden="true"
      >
        {props.name}
        {/* {props.children} */}
      </span>
    </>
  )
}
