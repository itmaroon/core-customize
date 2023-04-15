import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, PanelRow } from '@wordpress/components'; 
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';
import classnames from 'classnames';
  
const allowedBlocks = [ 'core/table' ];
  
const addExtraAttributes = ( settings ) => {
  
  if ( allowedBlocks.includes( settings.name ) ) {
    settings.attributes = Object.assign( settings.attributes, {
      horizontalAlignCenter: {
        type: 'boolean',
        default: false,
      },
      verticalAlignCenter: {
        type: 'boolean',
        default: false,
      },
      bottomSpace: {
        type: 'string',
        default:'',
      }
    } );
  }
  
  return settings;
}
addFilter(
  'blocks.registerBlockType',
  'my-name-space/add-extra-attributes',
  addExtraAttributes,
);
  
const addCustomControls = createHigherOrderComponent( ( BlockEdit ) => {
  
  return ( props ) => {
    if ( allowedBlocks.includes( props.name ) ) {
      const {
        setAttributes,
        isSelected,
        attributes
      } = props;
  
      const {
        className,
        horizontalAlignCenter,
        verticalAlignCenter,
        bottomSpace
      } = attributes;
  
      const unitControlProps = ( label, labelPosition, value ) => {
        return {
          label: label,
          labelPosition: labelPosition,
          value: value,
          units: [
            { value: 'px', label: 'px', default: 0 },
            { value: '%', label: '%', default: 0 },
            { value: 'vw', label: 'vw', default: 0 },
            { value: 'vh', label: 'vh', default: 0 },
          ],
          __unstableInputWidth: '80px',
        }
      }
  
      return (
        <Fragment>
          <BlockEdit { ...props } />
  
          { isSelected &&
            <InspectorControls>
              <PanelBody
                title= { __( 'Advanced Settings' ) }
                initialOpen={ false }>
                <ToggleControl
                  label={ __( 'Center all cells horizontally' ) }
                  checked={ horizontalAlignCenter }
                  onChange={ ( horizontalAlignCenter ) => setAttributes( { horizontalAlignCenter } ) }
                />
                <ToggleControl
                  label={ __( 'Center all cells vertically' ) }
                  checked={ verticalAlignCenter }
                  onChange={ ( verticalAlignCenter ) => setAttributes( { verticalAlignCenter } ) }
                />
  
                <PanelRow>
                  <UnitControl
                    { ...unitControlProps( __( 'Block bottom space' ), 'top', bottomSpace ) }
                    onChange={ ( bottomSpace ) => setAttributes( { bottomSpace } ) }
                  />
                </PanelRow>
              </PanelBody>
            </InspectorControls>
          }
        </Fragment>
      );
    }
  
    return <BlockEdit { ...props } />;
  }
}, 'addCustomControls' );
addFilter(
  'editor.BlockEdit',
  'my-name-space/add-custom-contorols',
  addCustomControls,
);
  
const applyExtraAttributesInEditor = createHigherOrderComponent( ( BlockListBlock ) => {
  
  return ( props ) => {
  
    const {
      attributes,
      className,
      name,
      isValid,
      wrapperProps
    } = props;
  
    if ( isValid && allowedBlocks.includes( name ) ){
  
      const {
        horizontalAlignCenter,
        verticalAlignCenter,
        bottomSpace
      } = attributes;
  
      const extraClass = [ {
        'center-horizontally': horizontalAlignCenter,
        'center-vertically': verticalAlignCenter,
      } ]
  
      const extraStyle = {
        marginBottom: bottomSpace ? bottomSpace : undefined
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
        <BlockListBlock { ...props }
          className={ classnames( className, extraClass ) }
          wrapperProps={ blockWrapperProps } />
      );
    }
  
    return (
      <BlockListBlock { ...props } />
    );
  };
}, 'applyExtraAttributesInEditor' );
addFilter(
  'editor.BlockListBlock',
  'my-name-space/apply-extra-attributes-in-editor',
  applyExtraAttributesInEditor,
);
  
const applyExtraAttributesInFrontEnd = ( props, blockType, attributes  ) => {
  
  if ( allowedBlocks.includes( blockType.name ) ) {
    const {
      setAttributes,
      isSelected,
      attributes
    } = props;
  
    const {
      className,
      horizontalAlignCenter,
      verticalAlignCenter,
      bottomSpace
    } = attributes;
  
    const extraClass = [ {
      'center-horizontally': horizontalAlignCenter,
      'center-vertically': verticalAlignCenter,
    } ]
  
    const extraStyle = {
      marginBottom: bottomSpace ? bottomSpace : undefined
    }
  
    props.className = classnames( props.className, extraClass );
  
    return Object.assign( props, { style: { ...props.style, ...extraStyle } } );
  }
  
  return props;
}
  
addFilter(
  'blocks.getSaveContent.extraProps',
  'my-name-space/apply-extra-attributes-in-front-end',
  applyExtraAttributesInFrontEnd,
);