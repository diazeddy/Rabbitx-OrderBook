import { useEffect, useState } from "react"

const PriceTable = ({data}) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    setKeys(Object.keys(data).sort((a, b) => Number(a) > Number(b) ? 1 : -1));
  }, [JSON.stringify(data)]);

  return (
    <table>
      <thead>
        <tr>
          <th>Price</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {
          keys.map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{data[key]}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default PriceTable;
