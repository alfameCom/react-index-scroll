import React from 'react';

export default class IndexScroll extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			
			items: [],
			currentDisplayRange: [ this.props.start, this.props.start + this.props.display ]

		};

		this.onScroll = this._onScroll.bind( this );
		this.createItemList = this._createItemList.bind( this );

	}

	componentWillMount() {

		let currentDisplayRange = this.state.currentDisplayRange;

		if( this.props.display > this.props.length ) {

			currentDisplayRange[ 0 ] = 0;
			currentDisplayRange[ 1 ] = this.props.length;

		} else if( currentDisplayRange[1] > this.props.length ) {

			currentDisplayRange[1] = this.props.length;
			currentDisplayRange[0] = currentDisplayRange[1] - this.props.display;

		}

		let items = this.createItemList( currentDisplayRange );
		this.setState( { currentDisplayRange: currentDisplayRange, items: items } );

	}
	
	componentDidMount() {
		
		this.onScroll();
		
	}

	componentWillReceiveProps( nextProps ) {

		if( nextProps.start != this.props.start ) {

			let currentDisplayRange = this.state.currentDisplayRange;			

			if( currentDisplayRange[1] > nextProps.length ) {

				currentDisplayRange[1] = nextProps.length;
				currentDisplayRange[0] = currentDisplayRange[1] - this.props.display;

			}

			let items = this.createItemList( currentDisplayRange );
			this.setState( { currentDisplayRange: currentDisplayRange, items: items } );

		}

	}

	_onScroll() {
		
		window.addEventListener( 'scroll', () => {

			let scrollTop = ( window.pageYOffset || document.documentElement.scrollTop ) - ( document.documentElement.clientTop || 0 );
			let documentHeight = Math.max(

				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight

			);

			if( scrollTop == 0 ) {

				let currentDisplayRange = this.state.currentDisplayRange;
			
				currentDisplayRange[0] -= this.props.display;
				currentDisplayRange[1] -= this.props.display;

				if( currentDisplayRange[0] >= 0 ) {

					let items = this.createItemList( currentDisplayRange );
					
					this.setState( { 
						items: items,
						currentDisplayRange: currentDisplayRange
					}, () => {

						let element = document.getElementById( 'IndexScrollItem-' + currentDisplayRange[0] );
						let bounds = element.getBoundingClientRect();

						window.scrollTo( 0, window.scrollY + bounds.top );
						
					} );

				} else {

					currentDisplayRange[0] = 0;
					currentDisplayRange[1] = this.props.display;

					this.setState( { currentDisplayRange: currentDisplayRange } );

				}

			} else if( scrollTop + window.innerHeight >= documentHeight ) {

				let currentDisplayRange = this.state.currentDisplayRange;
	
				currentDisplayRange[0] += this.props.display;
				currentDisplayRange[1] += this.props.display;

				if( currentDisplayRange[1] <= this.props.length ) {

					let items = this.createItemList( currentDisplayRange );
					
					this.setState( { 
						items: items,
						currentDisplayRange: currentDisplayRange 
					}, () => {
							
						let element = document.getElementById( 'IndexScrollItem-' + ( currentDisplayRange[0] - 1 ) );
						let bounds = element.getBoundingClientRect();

						window.scrollTo( 0, window.scrollY + bounds.top );
							
					} );

				} else {

					currentDisplayRange[1] = this.props.length;
					currentDisplayRange[0] = currentDisplayRange[1] - this.props.display;

					this.setState( { currentDisplayRange: currentDisplayRange } );

				}

			}

		} );

	}
	
	_createItemList( range ) {
		
		let items = [];
		let rangeFrom = range[0];
		let rangeTo = range[1]; 


				if( rangeFrom > 0 ) {

					rangeFrom -= this.props.padding;
					if( rangeFrom < 0 ) rangeFrom = 0;

				}
				
console.log( 'down', rangeFrom, rangeTo );
console.log( range );

		//console.log( rangeFrom, rangeTo );

		for( let i = rangeFrom; i < rangeTo; i++ ) {
			
			let key = 'IndexScrollItem-' + i;
			items.push( this.props.itemRenderer( i, key ) );
					
		}
		
		return items;
		
	}

	render() {

		let items = this.state.items;

		return (

			<div>
			{ items.map( ( item ) => {

				return item;

			} ) }
			</div>

		);

	}

}

IndexScroll.defaultProps = {

	start: 0,
	display: 5,
	length: 0,
	padding: 5,
	itemRenderer: function() { return null; }

};

IndexScroll.propTypes = {

	start: React.PropTypes.number,
	display: React.PropTypes.number,
	length: React.PropTypes.number,
	padding: React.PropTypes.number,
	itemRenderer: React.PropTypes.func

};
