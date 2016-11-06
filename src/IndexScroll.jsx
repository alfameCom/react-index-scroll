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

		const { currentDisplayRange } = this.state;
		
		let items = this.createItemList( currentDisplayRange );
		this.setState( { items: items } );

	}
	
	componentDidMount() {
		
		this.onScroll();
		
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
						
						window.scrollTo( 0, documentHeight - window.innerHeight - 1 );
						
					} );

				}

			} else if( scrollTop + window.innerHeight == documentHeight ) {

				let currentDisplayRange = this.state.currentDisplayRange;
	
				currentDisplayRange[0] += this.props.display;
				currentDisplayRange[1] += this.props.display;
				
				if( currentDisplayRange[1] <= this.props.itemCount ) {

					let items = this.createItemList( currentDisplayRange );
					
					this.setState( { 
						items: items,
						currentDisplayRange: currentDisplayRange 
					}, () => {
						
						let element = document.getElementById( 'IndexScrollItem-' + currentDisplayRange[0] );
						let bounds = element.getBoundingClientRect();

						window.scrollTo( 0, window.scrollY + bounds.top );
						
					} );

				}

			}

		} );

	}
	
	_createItemList( range ) {
		
		let items = [];
		for( let i = range[0]; i < range[1]; i++ ) {
			
			let key = 'IndexScrollItem-' + i;
			items.push( this.props.itemRenderer( i, key ) );
					
		}
		
		return items;
		
	}

	render() {

		const { items, buffer, currentDisplayRange } = this.state;
		const { itemCount, itemRenderer, display } = this.props;
console.log( 'asd' );
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
	itemCount: 0,
	itemRenderer: function() { return null; }

};

IndexScroll.propTypes = {

	start: React.PropTypes.number,
	display: React.PropTypes.number,
	itemCount: React.PropTypes.number,
	itemRenderer: React.PropTypes.func

};
