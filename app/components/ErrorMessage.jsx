import React, { Component } from 'react'
import {Grid, Message} from 'semantic-ui-react'

export default class ErrorMessage extends Component {
    render() {
        const { errorMessage, active } = this.props
        return active ? (
            <Grid verticalAlign='middle' stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Message negative header='Error' content={errorMessage} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        ) : null
    }
}