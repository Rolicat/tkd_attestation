const SelectInput = ({ label, name, value, onChange, options=[], className }) => {
    return (
      <div>
        <div> {label} </div>
        <div>
          <select name={name} className={className} value={value} onChange={e => onChange(e.target.value)}>
            {options.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>  
        </div>
      </div>
    );
};


export default SelectInput;