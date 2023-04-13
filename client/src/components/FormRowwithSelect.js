const FormRowSelect = ({ type, name, value, handleChange, labelText, options }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className='form-label'>
                {labelText || name}
            </label>
            <select
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                className="form-select"
            // defaultValue='' // add defaultValue prop
            >
                <option value=""> </option>
                {options.map((itemValue, index) => {
                    return (
                        <option key={index} value={itemValue}>
                            {itemValue}
                        </option>
                    );
                })}
            </select>
        </div>
    )
}

export default FormRowSelect