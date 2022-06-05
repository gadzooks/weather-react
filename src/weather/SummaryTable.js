import Region from './Region.js'

function SummaryTable(props) {
  const dates = props.date || ["SAT JUN 04", "SUN JUN 05", "MON JUN 06"];
  const regions = props.regions || [
    {
      name: "central_cascades",
      description: "Central Cascades",
      locations: [
        {
          name: "renton",
          description: "Renton",
          region: "central_cascades",
        },
        {
          name: "yakima",
          description: "Yakima",
          region: "central_cascades",
        },
      ],
    },
    {
      name: "central_wa",
      description: "Central Washington",
      locations: [
        {
          name: "seattle",
          description: "Seattle City",
          region: "central_wa",
        },
        {
          name: "bellevue",
          description: "Bellevue City",
          region: "central_wa",
        },
      ],
    },
  ];

  return (
    <table>
      <tr>
        <th>Weather Alerts</th>
        <th>Location</th>
        {dates.map((date) => {
          return <th>{date}</th>;
        })}
      </tr>
      {regions.map((r) => {
          return <Region region={r} />
      })}
    </table>
  );
}

export default SummaryTable;