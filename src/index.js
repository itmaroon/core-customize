//エントリーポイントとしてスタイルシートをインポート
import './style.scss'

//必要なコンポーネントをインポート
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
    InspectorControls
} = window.wp.editor;
 
const { createHigherOrderComponent } = wp.compose;


//core/buttonのカスタマイズ
const allowedBlocks = [ 'core/button' ];

//core/buttonに新しいattributes属性を追加
const addBtnDesignAttributes = ( settings ) => {
	// core/buttonだったら
	if ( allowedBlocks.includes( settings.name ) ) {
		// 追加
		settings.attributes = Object.assign( settings.attributes, {
			BoxShadowLight: {
				type: 'string',
				default: '',
			},
			BoxShadowDark: {
				type: 'string',
				default: '',
			},
			BoxShadowShape: {
				type: 'string',
				default: '',
			},
			BoxShadowDirection: {
				type: 'string',
				default: '',
			}
		} );
	}
	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'itmar_core_customize/add_block_design_attr',
	addBtnDesignAttributes,
);

//選択されたブロックがcore/buttonだったらサードバーに新しい設定メニューを追加
export const addBtnDesignCtrl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// isValidBlockType で指定したブロックが選択されたら表示
		if ( allowedBlocks.includes( props.name ) && props.isSelected ) {
			// 拡張スタイル

			const setBoxShadow = (prm, val)=>{
				props.setAttributes({BoxShadowLight: "5px 5px 5px red"})
			}

			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls group="styles">
            <PanelBody title="ボタンデザイン設定" initialOpen={ false } className="btn_design_ctrl">
							<RangeControl
								initialPosition={50}
								label="Distanse"
								max={100}
								min={0}
								onChange={(val) => setBoxShadow('distanse',val)}
								withInputField={ false }
							/>
							<RangeControl
								initialPosition={50}
								label="Intensity"
								max={100}
								min={0}
								onChange={(val) => setBoxShadow('intensity',val)}
								withInputField={ false }
							/>
							<RangeControl
								initialPosition={50}
								label="Blur"
								max={100}
								min={0}
								onChange={(val) => setBoxShadow('blur',val)}
								withInputField={ false }
							/>
						</PanelBody>
          </InspectorControls>                
				</Fragment>
      );
		}
		return <BlockEdit { ...props } />;
	};
});
addFilter('editor.BlockEdit', 'itmar_core_customize/add_block_design', addBtnDesignCtrl);

//エディタ画面での描画
const applyExtraAttributesInEditor = createHigherOrderComponent( ( BlockListBlock ) => {
  return ( props ) => {
    const {
      attributes,
      name,
      isValid,
			wrapperProps
    } = props;
  
    if ( isValid && allowedBlocks.includes( name ) ){
			const {
        BoxShadowLight,
      } = attributes;
  
      const extraStyle = {
        boxShadow: BoxShadowLight ? BoxShadowLight : undefined
      }
  
      let blockWrapperProps = wrapperProps;
      blockWrapperProps = {
				...blockWrapperProps,
				style: {
					...( blockWrapperProps && { ...blockWrapperProps.style } ),
					...extraStyle
				},
			};
  
      return (
        <BlockListBlock  { ...props }
					wrapperProps={ blockWrapperProps }
           />
      );
		}
  
    return (
      <BlockListBlock  { ...props } />
    );
  };
} );
addFilter(
  'editor.BlockListBlock',
  'my-name-space/apply-extra-attributes-in-editor',
  applyExtraAttributesInEditor,
);
 
