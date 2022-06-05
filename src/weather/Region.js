import Location from './Location.js'
function Region(props) {
    const region = props.region;
    const colspan = region.colspan || "5";
    const locations = region.locations;
    return (
      <>
        <tr>
          <td colspan={colspan} bgcolor="red" align="center">
            {region.description};
          </td>
        </tr>
        {locations.map((l) => {
            return <Location location={l} />
        })}
      </>
    );

}

export default Region;