import React, { Component } from 'react'
import { Grid, Image, Icon, Form as SemanticForm } from 'semantic-ui-react'

export default class Form extends Component {
    render() {
        const {isSearching, videoUrlError, onChangeInput, onSearch} = this.props
        return (
            <Grid.Row>
                <Grid.Column width={12}>
                    <Image src='/logo.png' size='huge' alt='youtube-logo' centered />
                    <SemanticForm>
                        <SemanticForm.Input fluid placeholder='Video URL or ID'
                            autoFocus
                            disabled={isSearching}
                            action={{
                                icon: 'search',
                                color: 'red',
                                content: 'Search',
                                labelPosition: 'right',
                                size: 'small',
                                loading: isSearching,
                                onClick: onSearch
                            }}
                            maxLength={255}
                            icon={<Icon name='youtube' />}
                            iconPosition='left'
                            onChange={(event, { value }) => onChangeInput(value)}
                            error={videoUrlError ? {
                                content: 'Invalid URL/ID.',
                                pointing: 'below'
                            } : null}
                        />
                    </SemanticForm>
                </Grid.Column>
            </Grid.Row>
        )
    }
}