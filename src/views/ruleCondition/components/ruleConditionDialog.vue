<template>
	<el-dialog v-model="dialogVisible" :title="title" class="rule-condition-dialog">
		<el-form class="rule-condition-form">
			<el-form-item class="item-name" label="规则名称：" props="ruleName" :label-width="120">
				<el-input v-model="form.ruleName" class="item-name-input" placeholder="请输入名称"></el-input>
			</el-form-item>
			<el-form-item  class="item-priority" label="策略优先级：" props="priority" :label-width="120">
				<el-input v-model="form.priority" class="item-priority-input" type="number" placeholder="请输入策略优先级"></el-input>
			</el-form-item>
			<el-form-item class="item-connect-rule" label="关联审核规则：" props="app_connect_id" :label-width="120">
				<el-select v-model="form.app_connect_id" class="item-connect-rule-select" placeholder="请选择关联审核规则">
					<el-option
						v-for="item in [{ label: '规则一', value: 1 }, { label: '规则二', value: 2 }]"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
						规则
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="item-logic" label="策略逻辑：" props="logic" :label-width="120">
				<el-radio v-model="logic" value="OR" class="item-logic-radio" label="满足以下任意条件时生效"></el-radio>
				<el-radio v-model="logic" value="AND" class="item-logic-radio" label="满足全部条件时生效"></el-radio>
			</el-form-item>
			<div class="conditions-content">
				<div class="condition-logic">
          <span>{{ logic }}</span>
        </div>
        <div class="conditions-item" >
          <div v-for="(item, index) in mockData.conditions" :key="index">
            <rule-condition-item :condition="item"></rule-condition-item>
          </div>
        </div>
			</div>
			<div>
				<el-button></el-button>
				<el-button></el-button>
			</div>
		</el-form>
    <div class="data-preview">
      <h2>规则数据预览</h2>
      <pre>{{ JSON.stringify(mockData, null, 2) }}</pre>
    </div>
	</el-dialog>
</template>

<script>
import RuleConditionItem from './ruleConditionItem.vue';

export default {
	name: 'RuleConditionDialog',
	components: {
    RuleConditionItem
  },
	props: {
		title: {
			type: String,
			default: '添加关联规则'
		},
	},
	setup() {
		return {};
	},
	data() {
		return {
			dialogVisible: true,
			logic: 'AND',
			form: {
				ruleName: '',
			},
      mockData: {
        logic: "AND",
        conditions: [
          {
            field: "buTag",
            operator: "in",
            value: ["快消零售KA", "教育培训KA"],
            newValue: ""
          },
          {
            field: "shopId",
            operator: "in",
            value: ["appxxx", "appyyy", "appzzz"],
            newValue: ""
          },
          {
            logic: "OR",
            conditions: [
              {
                field: "shopVersion",
                operator: "equals",
                value: "试用版"
              },
              {
                field: "shopCreateTime",
                operator: "gte",
                value: "2024-01-01"
              }
            ]
          }
        ]
      }
		}
	}
}
</script>

<style lang="scss" scoped>

.rule-condition-dialog {
	width: 1060px;
	color: #111;
	font-weight: 400;
	background-color: #999;
}
.rule-condition-form {

	.el-form-item {
		margin-bottom: 10px;
	}
}

.item-name {

	&-input {
		width: 300px;
	}
}

.item-priority {

	&-input {
		width: 300px;
	}
}

.item-connect-rule {

	&-select {
		width: 300px;
	}
}

.item-logic {

  &-radio {
    width: 180px;
  }
}

.conditions-content {
  display: flex;
  padding: 5px;
}

.condition-logic {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 50px;

  span {
    background: #1da1ff;
    color: #fff;
    padding: 5px;
    border-radius: 10%;
  }
}

.conditions-item {
  width: 800px;
  display: block;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 14px;
}
</style>