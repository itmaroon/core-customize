import './style.scss'

const { assign } = lodash;
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { addFilter } = wp.hooks;
const {
    PanelBody,
		PanelRow,
    RadioControl,
		RangeControl
} = wp.components;
 
const {
    InspectorControls,
} = window.wp.editor;
 
const { createHigherOrderComponent } = wp.compose;

const isValidBlockType = ( name ) => {
	const validBlockTypes = [
			'core/paragraph',   // 段落
			'core/list',        // リスト
			'core/image'        // イメージ
	];
	return validBlockTypes.includes( name );
};

export function addAttribute( settings ) {
	if ( isValidBlockType( settings.name ) ) {
			settings.attributes = assign( settings.attributes, {
				marginSetting: {
						type: 'string',
				},
			} );
	}
	return settings;
}
addFilter( 'blocks.registerBlockType', 'itmar_core_customize/add-attr', addAttribute );

//特定のコアコンポーネントが選択されたときマージンを入れる
export const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// isValidBlockType で指定したブロックが選択されたら表示
		if ( isValidBlockType( props.name ) && props.isSelected ) {
			// すでにオプション選択されていたら
			let selectOption = props.attributes.marginSetting || '';
			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
            <PanelBody title="マージン設定" initialOpen={ false } className="margin-controle">
							<RadioControl
								selected={ selectOption }
								options={ [
									{ label: 'なし', value: '' },
									{ label: '小', value: 'mb-sm' },
									{ label: '中', value: 'mb-md' },
									{ label: '大', value: 'mb-lg' },
								] }
								onChange={ ( changeOption ) => {
									let newClassName = changeOption;
									// 高度な設定で入力している場合は追加する
									if (props.attributes.className) {
										// 付与されているclassを取り出す
										let inputClassName = props.attributes.className;
										// スペース区切りを配列に
										inputClassName = inputClassName.split(' ');
										// 選択されていたオプションの値を削除
										let filterClassName = inputClassName.filter(function(name) {
											return name !== selectOption;
										});
										// 新しく選択したオプションを追加
										filterClassName.push(changeOption);
										// 配列を文字列に
										newClassName = filterClassName.join(' ');
									}
									// 新しく選択したオプションをselectOptionに
									selectOption = changeOption;
									props.setAttributes({
										className: newClassName,
										marginSetting: changeOption
									});
							} }	
							/>
						</PanelBody>
          </InspectorControls>                
				</Fragment>
      );

		}
		return <BlockEdit { ...props } />;
	};
}, 'addMyCustomBlockControls' );
addFilter('editor.BlockEdit', 'itmar_core_customize/block-control', addBlockControl);

//なしを選択したときに属性を削除
export function addSaveProps( extraProps, blockType, attributes ) {
	if ( isValidBlockType( blockType.name ) ) {
			// なしを選択した場合はmarginSetting削除
			if (attributes.marginSetting === '') {
					delete attributes.marginSetting;
			}
	}
	return extraProps;
}
addFilter( 'blocks.getSaveContent.extraProps', 'itmar_core_customize/add-props', addSaveProps )
