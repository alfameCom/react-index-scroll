import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, hashHistory } from 'react-router'
import IndexScroll from './IndexScroll'

export default class Main extends React.Component {

	constructor() {

		super();

		this.state = {

			items: (new Array(100)).fill({

				name: 'asd'

			} )

		};

	}

	render() {

		return (

			<div>
				<p>Test List:</p>
				<IndexScroll
					itemCount={this.state.items.length}
					itemRenderer={( index, key ) => {

						return (

							<div
								id={key}
								key={key}
								style={{border: 'medium solid black', height: '500px'}}>
									{index} { this.state.items[ index ].name }
								</div>

						);

					}}
					/>
			</div>

		);

	}

}

ReactDOM.render(

<Router history={hashHistory}>
	<Route path="/">
		<IndexRoute component={Main} />
	</Route>
</Router>
, document.getElementById( 'react' ) );
