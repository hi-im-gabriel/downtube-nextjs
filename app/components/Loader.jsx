import React, { Component } from 'react'
import { Grid, Dimmer, Loader as SemanticLoader } from 'semantic-ui-react'

export default class Loader extends Component {
    render() {
        return (
            <Grid textAlign='center' style={{ height: '100%', alignContent: 'center', backgroundColor: '#323232' }}>
                <Dimmer active>
                    <SemanticLoader />
                </Dimmer>
            </Grid>
        )
    }
}
