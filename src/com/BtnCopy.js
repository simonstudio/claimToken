import React from "react";
import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

class BtnCopy extends React.Component {
    state = {
        icon: <CopyOutlined />
    }
    copy = (value) => {
        // console.log(this.state.icon)
        navigator.clipboard.writeText(value);
        this.setState({ icon: "✔️" })
        setTimeout(() => {
            this.setState({ icon: <CopyOutlined /> })
        }, 1500);
    }

    render() {
        let { text, value } = this.props;
        return (
            <Tooltip title={text ? text : "Copy"}>
                <label alt="copy" style={styles.btnCopy} onClick={(e) => this.copy(value)}>
                    {this.state.icon}
                </label >
            </Tooltip>
        )
    }
}

const styles = {
    btnCopy: {
        cursor: "pointer",
        margin: "0px 0px 0px 10px",
    },
    btnChecked: {
        cursor: "pointer", color: "green"
    },
}
export default BtnCopy;