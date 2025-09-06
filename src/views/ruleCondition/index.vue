<template>

	<div class="data-preview">
		<h2>规则数据预览</h2>
		<pre>{{ JSON.stringify(ruleData, null, 2) }}</pre>
	</div>
	<rule-condition-dialog></rule-condition-dialog>
</template>

<script>
import { ref, reactive } from 'vue'
import ruleConditionDialog from './components/ruleConditionDialog.vue';

export default {
	components: {
		ruleConditionDialog
	},
	setup() {
		// 规则数据
		const ruleData = reactive({
			logic: "AND",
			conditions: [
				{
					id: generateId(),
					field: "buTag",
					operator: "in",
					values: ["快消零售KA", "教育培训KA"],
					newValue: ""
				},
				{
					id: generateId(),
					field: "shopId",
					operator: "in",
					values: ["appxxx", "appyyy", "appzzz"],
					newValue: ""
				},
				{
					id: generateId(),
					logic: "OR",
					conditions: [
						{
							id: generateId(),
							field: "shopVersion",
							operator: "equals",
							value: "试用版"
						},
						{
							id: generateId(),
							field: "shopCreateTime",
							operator: "gte",
							value: "2024-01-01"
						}
					]
				}
			]
		});
		
		// 可用字段列表
		const fields = ref([
			{ label: '店铺BU标签', value: 'buTag' },
			{ label: '店铺ID', value: 'shopId' },
			{ label: '店铺版本', value: 'shopVersion' },
			{ label: '店铺创建时间', value: 'shopCreateTime' }
		]);
		
		// 可用操作符
		const operators = ref([
			{ label: '包含', value: 'in' },
			{ label: '不包含', value: 'notIn' },
			{ label: '等于', value: 'equals' },
			{ label: '不等于', value: 'notEquals' },
			{ label: '大于', value: 'gt' },
			{ label: '大于等于', value: 'gte' },
			{ label: '小于', value: 'lt' },
			{ label: '小于等于', value: 'lte' }
		]);
		
		// 生成唯一ID
		function generateId() {
			return Date.now() + Math.random().toString(16).slice(2);
		}
		
		// 添加条件
		const addCondition = () => {
			ruleData.conditions.push({
				id: generateId(),
				field: 'shopVersion',
				operator: 'equals',
				value: '',
				values: [],
				newValue: ''
			});
		};
		
		// 删除条件
		const removeCondition = (index) => {
			ruleData.conditions.splice(index, 1);
		};
		
		// 添加嵌套条件组
		const addNestedCondition = () => {
			ruleData.conditions.push({
				id: generateId(),
				logic: "OR",
				conditions: [
					{
						id: generateId(),
						field: 'shopVersion',
						operator: 'equals',
						value: '试用版'
					}
				]
			});
		};
		
		// 删除嵌套条件组
		const removeNestedCondition = (index) => {
			ruleData.conditions.splice(index, 1);
		};
		
		// 添加嵌套条件项
		const addNestedConditionItem = (index) => {
			ruleData.conditions[index].conditions.push({
				id: generateId(),
				field: 'shopVersion',
				operator: 'equals',
				value: '',
				values: [],
				newValue: ''
			});
		};
		
		// 删除嵌套条件项
		const removeNestedConditionItem = (parentIndex, conditionIndex) => {
			ruleData.conditions[parentIndex].conditions.splice(conditionIndex, 1);
		};
		
		// 为多值字段添加值
		const addValue = (condition) => {
			if (condition.newValue.trim()) {
				if (!condition.values) condition.values = [];
				condition.values.push(condition.newValue.trim());
				condition.newValue = '';
			}
		};
		
		// 为嵌套多值字段添加值
		const addNestedValue = (condition, conditionIndex) => {
			const nestedCondition = condition.conditions[conditionIndex];
			if (nestedCondition.newValue.trim()) {
				if (!nestedCondition.values) nestedCondition.values = [];
				nestedCondition.values.push(nestedCondition.newValue.trim());
				nestedCondition.newValue = '';
			}
		};
		
		// 删除多值字段中的值
		const removeValue = (condition, valueIndex) => {
			condition.values.splice(valueIndex, 1);
		};
		
		// 删除嵌套多值字段中的值
		const removeNestedValue = (condition, conditionIndex, valueIndex) => {
			condition.conditions[conditionIndex].values.splice(valueIndex, 1);
		};
		
		return {
			ruleData,
			fields,
			operators,
			addCondition,
			removeCondition,
			addNestedCondition,
			removeNestedCondition,
			addNestedConditionItem,
			removeNestedConditionItem,
			addValue,
			addNestedValue,
			removeValue,
			removeNestedValue
		};
	}
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
}
h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}
.rule-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.rule-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.rule-type {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.rule-type label {
  margin-right: 10px;
  font-weight: 600;
}
.rule-radios {
  display: flex;
  gap: 15px;
}
.rule-radio {
  display: flex;
  align-items: center;
  gap: 5px;
}
.condition-group {
  background: #fff;
  border-radius: 6px;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #eaeaea;
}
.condition-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}
.condition-title {
  font-weight: 600;
  margin-right: 15px;
}
.condition-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  flex-wrap: wrap;
}
.condition-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ddd;
}
select, input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 120px;
}
.or-label {
  background: #e3f2fd;
  color: #1565c0;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
  margin-right: 10px;
}
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.btn-primary {
  background-color: #3498db;
  color: white;
}
.btn-primary:hover {
  background-color: #2980b9;
}
.btn-success {
  background-color: #2ecc71;
  color: white;
}
.btn-success:hover {
  background-color: #27ae60;
}
.btn-danger {
  background-color: #e74c3c;
  color: white;
}
.btn-danger:hover {
  background-color: #c0392b;
}
.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
}
.btn-outline:hover {
  background: #f5f5f5;
}
.add-condition {
  margin-top: 15px;
}
.data-preview {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}
pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 14px;
}
.field-input {
  display: flex;
  align-items: center;
  gap: 5px;
}
.remove-tag {
  cursor: pointer;
  color: #999;
  font-size: 16px;
  margin-left: 5px;
}
.remove-tag:hover {
  color: #e74c3c;
}
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}
.tag {
  background: #e3f2fd;
  color: #1565c0;
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
</style>

