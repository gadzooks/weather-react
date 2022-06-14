export const allAlertsLink = '#all-alerts';

export function AlertSummary(props) {
    const total = props.alerts.length;

    if (total === 0) {
        return null;
    } else if (total === 1) {
        return <Link to={allAlertsLink}>1 Alert</Link>

    } else {
        return <Link to={allAlertsLink}>`${total} Alerts`</Link>
    }
}

