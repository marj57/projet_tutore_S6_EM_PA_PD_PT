import React, { Component } from 'react';

import { Tag, Input, Tooltip, Icon } from 'antd';
import "antd/dist/antd.css";

export default class TagsField extends Component {
    constructor(props) {
        super(props);

        var defaultValue = []
        if(this.props.defaultValue != undefined) {
            var temp = this.props.defaultValue;
            for(var i=0; i<temp.length; i++) {
                if(temp[i] != null && temp[i] != "") {
                    defaultValue.push(temp[i]);
                }
            }
        }

        var min=0;
        var isValid = true;

        if(this.props.min != undefined && this.props.min > 0) {
            min = this.props.min; 
            
            if(defaultValue.length >= min) {
                isValid = true;
            }
        }


        this.state = {
            tags: defaultValue,
            inputVisible: false,
            inputValue: '',
            min: min,
            isValid: isValid,
            error: "",
        };

        if(this.props.onTagChange == undefined) {
            console.error("Le champs TagsField nécessite une fonction nommée onTagChange !");
            return;
        }

        this.notifyTagChange(defaultValue, isValid);
    }

    notifyTagChange(tagsList, valid) {
        this.props.onTagChange({tag: tagsList, valid: valid});
    }
    
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);

        this.setState({ tags });

        this.checkValid(tags);
    }

    checkValid(tagsList) {
        var valid = false;
        if(tagsList.length >= this.state.min) {
            valid = true;
            this.setState({isValid: valid});
        } else {
            this.setState({isValid: valid, error: "Vous devez avoir au moins "+this.state.min+" tag(s) !"});
        }

        this.notifyTagChange(tagsList, valid);
    }
    
    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }

        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });

        this.checkValid(tags);
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    saveInputRef = input => this.input = input


    render() {
        const { tags, inputVisible, inputValue, isValid } = this.state;

        return (
          <div>
            {tags.map((tag, index) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && isValid &&(
              <Tag
                onClick={this.showInput}
                style={{ background: '#fff', borderStyle: 'dashed' }}
              >
                <Icon type="plus" /> New Tag
              </Tag>
            )}
            {!inputVisible && !isValid &&(
                <div style={{ display: 'inline', color: '#f5222d' }}>
                    <Tag onClick={this.showInput} style={{ background: '#fff', border: '1.5px dashed #f5222d', color: '#f5222d' }}>
                        <Icon type="plus" /> New Tag
                    </Tag>
                    <p>{this.state.error}</p>
                </div>
            )}
          </div>
        );
    }
}