import React from 'react';
import { makeStyles } from '@mui/material';

const useStyles = makeStyles({
    page: {
        background: '#f9f9f9',
        width: '100%',
    }
})

export default function Layout(children: any) {
    // const classes = useStyles();

    return(
        <div>
            <div>
                {children}
            </div>
        </div>


    )

}