console.log('magicblock is up and running');

const { registerBlockType } = wp.blocks;
const { InspectorControls, InnerBlocks, PlainText} = wp.editor;
const { Fragment } = wp.element;
const { PanelBody, SelectControl } = wp.components;

const icon = () => {
   return (<svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.17,11.29m7.51-3.44,3.82,2.28-3.82,2.31v1.65L20,11V9.31L14.68,6.19ZM5.32,12.42,1.5,10.14,5.32,7.83V6.19L0,9.31V11l5.32,3.13Zm3.52-2.28L6.55,14.59H8.42l1.44-3,1.7,3h1.89L11,10.11l2.44-4.43H11.47L10.07,8.5,8.5,5.68H6.6Z"></path>
           </svg>);
};

registerBlockType( 'magicblock/magicblock', {
    title: 'Magic Block',
    icon: icon,
    category: 'layout',
    supports: {
        customClassName: false
    },
    attributes: {
        className: {
            type: 'string'
        },
        inlineStyle: {
            type: 'string',
            source: 'attribute',
            selector: '.wp-block-magicblock-magicblock',
            attribute: 'style',
        }, 
        href: {
            type: 'string',
            source: 'attribute',
            selector: '.wp-block-magicblock-magicblock',
            attribute: 'href',
        },
        elemId: {
            type: 'string',
            source: 'attribute',
            selector: '.wp-block-magicblock-magicblock',
            attribute: 'id',
        }, 
        elemClass: {
            type: 'string'
        },
        elemTag: {
            type: 'string'
        }
    },

    edit:  props => {
        let inlineSytle = props.attributes.inlineStyle,
                elemTag = props.attributes.elemTag,
                elemId = props.attributes.elemId,
                elemClass = props.attributes.elemClass,
                href = props.attributes.href;

        function convertClassString(input) {
            return  input.replace(/\s+$/g, '').replace(/[ ]+/g, ".");
        }

        function onChangeElem( newElem ) {
            props.setAttributes( { elemTag: newElem } );
        }

        function onChangeInlineStyle ( newInlineStyle ) {
            props.setAttributes( { inlineStyle: newInlineStyle } );
        }

        function onChangeID ( newID ) {
            props.setAttributes( { elemId: newID } );
        }

        function onChangeClass ( newClass ) {
            props.setAttributes( { elemClass: newClass } );
        }

        function onChangeHref ( newHref ) {
            props.setAttributes( { href: newHref } );
        }

 

        const linkPanels = (
            <PanelBody title="Link Href">
                <PlainText onChange={onChangeHref} value={href} className="magicblock-plaintext"/>
            </PanelBody>
        );

        return  (
            <Fragment>
                <InspectorControls>
                     <PanelBody title="Element Type">
                        <SelectControl label="Tag" value={elemTag} onChange={onChangeElem} options={[ 
                                    { label: "div", value: "div"},
                                    { label: "section", value: 'section'},
                                    { label: "main", value: 'main'},
                                    { label: "aside", value: 'aside'},
                                    { label: "article", value: 'article'},
                                    { label: "header", value: 'header'},
                                    { label: "footer", value: 'footer'},
                                    { label: "nav", value: 'nav'},
                                    { label: "dl", value: 'dl'},
                                    { label: "dd", value: 'dd'},
                                    { label: "dt", value: 'dt'},
                                    { label: "a", value: "a"}
                                     ]} 
                                     /> 
                        {  elemTag === "a" ? (<div>
                                                <strong>Please note:</strong> it is <a href="https://www.w3.org/TR/html5/text-level-semantics.html#the-a-element" target="_blank">invalid HTML</a> to nest an `a` tag inside another `a` tag. If you do this, browsers will render it in unexpected ways. 
                                            </div>) : null }

                     </PanelBody>
                     {  elemTag === "a" ? linkPanels : null }
                     <PanelBody title="ID">
                        <PlainText onChange={onChangeID} value={elemId} className="magicblock-plaintext"/>
                     </PanelBody>
                     <PanelBody title="Class(es)">
                        <PlainText onChange={onChangeClass} value={elemClass} className="magicblock-plaintext"/>
                     </PanelBody>
                     <PanelBody title="Inline CSS">
                        <PlainText onChange={onChangeInlineStyle} value={inlineSytle} className="magicblock-plaintext"/>
                     </PanelBody>
                </InspectorControls>
                <div className="magicblock-editor">
                   <div className="magicblock-label">
                        <span className="magicblock-attr-span">{elemTag || "div"}</span>
                        { elemId && <span className="magicblock-id-span">#{elemId}</span> }
                        { elemClass && <span className="magicblock-class-span">.{convertClassString(elemClass)}</span> }
                   </div>
                   <InnerBlocks />
                </div>
            </Fragment>
        );
    },
    save: props => {
        let inlineSytle = props.attributes.inlineStyle,
        elemId = props.attributes.elemId, 
        elemClass = props.attributes.elemClass,
        ElemTag = props.attributes.elemTag || "div", 
        href = props.attributes.href || "";        

        const aProps = {};
        if(ElemTag === "a" && href){
            aProps.href = href;
        }

        return (<ElemTag
                className={elemClass} 
                style={inlineSytle} 
                id={elemId}
                {...aProps}
                >
                    <InnerBlocks.Content/>
                </ElemTag>);
         }
    }
); 
