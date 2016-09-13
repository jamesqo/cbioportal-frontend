/* eslint-disable */

import * as $ from 'jquery';

const PORTAL_HOME = 'http://www.cbioportal.org/pdx/';

const cbioportal_client = (function () {
	                                const raw_service = (function () {
		                                const getApiCallPromise = function (endpt, args) {
			                                const arg_strings = [];
			                                        for (const k in args) {
				                                        if (args.hasOwnProperty(k)) {
					                                        arg_strings.push(k + '=' + [].concat(args[k]).join(','));
				}
			}
			                                const arg_string = arg_strings.join('&') || '?';
			                                        return $.ajax({
				                                        type: 'POST',
				                                        url: PORTAL_HOME + endpt,
				                                        data: arg_string,
				                                        dataType: 'json',
			});
		};
		                                const functionNameToEndpointProperties = {
			                                        'CancerTypes': { endpoint: 'api/cancertypes' },
			                                        'SampleClinicalData': { endpoint: 'api/clinicaldata/samples' },
			                                        'PatientClinicalData': { endpoint: 'api/clinicaldata/patients' },
			                                        'SampleClinicalAttributes': { endpoint: 'api/clinicalattributes/samples' },
			                                        'PatientClinicalAttributes': { endpoint: 'api/clinicalattributes/patients' },
			                                        'ClinicalAttributes': { endpoint: 'api/clinicalattributes' },
			                                        'Genes': { endpoint: 'api/genes' },
			                                        'GeneticProfiles': { endpoint: 'api/geneticprofiles' },
			                                        'SampleLists': { endpoint: 'api/samplelists' },
			                                        'SampleListsMeta': { endpoint: 'api/samplelists', args: { metadata: true } },
			                                        'Patients': { endpoint: 'api/patients' },
			                                        'GeneticProfileData': { endpoint: 'api/geneticprofiledata' },
			                                        'Samples': { endpoint: 'api/samples' },
			                                        'Studies': { endpoint: 'api/studies' },
			                                        'MutationCounts': { endpoint: 'api/mutation_count' },
		};
		                                const ret = {};
		                                        for (const fn_name in functionNameToEndpointProperties) {
			                                        if (functionNameToEndpointProperties.hasOwnProperty(fn_name)) {
				                                        ret['get' + fn_name] = (function (props) {
					                                        return function (args) {
						                                        return getApiCallPromise(props.endpoint, $.extend(true, {}, args, props.args));
					};
				})(functionNameToEndpointProperties[fn_name]);
			}
		}
		                                        return ret;
	})();
	                                        function Index(key) {
		                                const map = {};
		                                const stringSetDifference = function (A, B) {
			// In A and not in B
			                                const in_A_not_in_B = {};
			                                    let i, _len;
			                                        for (i = 0, _len = A.length; i < _len; i++) {
				                                        in_A_not_in_B[A[i]] = true;
			}
			                                        for (i = 0, _len = B.length; i < _len; i++) {
				                                        in_A_not_in_B[B[i]] = false;
			}
			                                const ret = [];
			                                        for (i = 0, _len = A.length; i < _len; i++) {
				                                        if (in_A_not_in_B[A[i]]) {
					                                        ret.push(A[i]);
				}
			}
			                                        return ret;
		};
		                                        this.clear = function (data, args) {
			                                    let i;
			                                const _len = data.length;
			// Clear existing data for touched keys
			                                        for (i = 0; i < _len; i++) {
				                                const datum_key = key(data[i], args);
				                                        map[datum_key] = [];
			}
		};
		                                        this.addData = function (data, args, append) {
			                                    let i;
			                                const _len = data.length;
			                                        if (!append) {
				// Clear existing data for touched keys
				                                        for (i = 0; i < _len; i++) {
					                                const datum_key = key(data[i], args);
					                                        map[datum_key] = [];
				}
			}
			// Add data
			                                        for (i = 0; i < _len; i++) {
				                                const d = data[i];
				                                        map[key(d, args)].push(d);
			}
		};
		                                        this.getData = function (keys, datumFilter) {
			                                        keys = keys || Object.keys(map);
			                                        keys = [].concat(keys);
			                                    let i, datum;
			                                    let ret = [], _len = keys.length;
			                                        for (i = 0; i < _len; i++) {
				                                        datum = map[keys[i]];
				                                        if (typeof datum !== 'undefined' && (!datumFilter || datumFilter(datum))) {
					                                        ret = ret.concat(datum);
				}
			}
			                                        return ret;
		};

		                                        this.missingKeys = function (keys) {
			                                        return stringSetDifference([].concat(keys), Object.keys(map));
		};
	}
	                                const keyCombinations = function (key_list_list, list_of_lists) {
		                                    let ret = [[]];
		                                        for (let i = 0; i < key_list_list.length; i++) {
			                                const intermediate_ret = [];
			                                const key_list = key_list_list[i];
			                                        for (let j = 0; j < key_list.length; j++) {
				                                        for (let k = 0; k < ret.length; k++) {
					                                        intermediate_ret.push(ret[k].concat([(list_of_lists ? [].concat(key_list[j]) : key_list[j])]));
				}
			}
			                                        ret = intermediate_ret;
		}
		                                        return ret;
	};
	                                        function HierIndex(key) {
		                                const fully_loaded = {};
		                                const map = {};
		                                        this.markFullyLoaded = function (key) {
			                                    let curr_obj = fully_loaded;
			                                        for (let i = 0; i < key.length; i++) {
				                                        if (curr_obj === true) {
					                                        break;
				}
				                                const sub_key = key[i];
				                                        if (i < key.length - 1) {
					                                        curr_obj[sub_key] = curr_obj[sub_key] || {};
					                                        curr_obj = curr_obj[sub_key];
				} else {
					                                        curr_obj[sub_key] = true;
				}
			}
		};
		                                        this.isFullyLoaded = function (key) {
			                                    let curr_obj = fully_loaded;
			                                        for (let i = 0; i < key.length; i++) {
				                                        if (curr_obj === true || typeof curr_obj === 'undefined') {
					                                        break;
				}
				                                const sub_key = key[i];
				                                        curr_obj = curr_obj[sub_key];
			}
			                                        return (curr_obj === true);
		};
		                                        this.addData = function (data, args) {
			                                    let i, _len = data.length, j;
			// Clear existing data for touched keys, and initialize map locations
			                                        for (i = 0; i < _len; i++) {
				                                        var datum_key = key(data[i], args);
				                                        var map_entry = map;
				                                        for (j = 0; j < datum_key.length; j++) {
					                                const sub_key = datum_key[j];
					                                        if (j < datum_key.length - 1) {
						                                        map_entry[sub_key] = map_entry[sub_key] || {};
					} else {
						                                        map_entry[sub_key] = [];
					}
					                                        map_entry = map_entry[sub_key];
				}
			}
			// Add data
			                                        for (i = 0; i < _len; i++) {
				                                        var datum_key = key(data[i], args);
				                                        var map_entry = map;
				                                        for (j = 0; j < datum_key.length; j++) {
					                                        map_entry = map_entry[datum_key[j]];
				}
				                                        map_entry.push(data[i]);
			}
		};

		                                const flatten = function (list_of_lists) {
			// console.log("flatten: " + ret.length);
			                                const chunk_size = 90000;
			                                const n_chunks = Math.ceil(list_of_lists.length / chunk_size);
			                                const flattened = [];
			// first round of flattening, in chunks of chunkSize to avoid stack size problems in concat.apply:
			                                        for (let k = 0; k < n_chunks; k++) {
				                                        flattened.push([].concat.apply([], list_of_lists.slice(k * chunk_size, (k + 1) * chunk_size)));
			}
			// final round, flattening the lists of lists to a single list:
			                                        return [].concat.apply([], flattened);
		};

		                                        this.getData = function (key_list_list) {
			                                    let intermediate = [map];
			                                    let ret = [];
			                                    let i, j, k;
			                                        key_list_list = key_list_list || [];
			                                    let key_list_index = 0;
			                                        while (intermediate.length > 0) {
				                                const tmp_intermediate = [];
				                                        for (i = 0; i < intermediate.length; i++) {
					                                const obj = intermediate[i];
					                                        if (Object.prototype.toString.call(obj) === '[object Array]') {
						                                        ret.push(obj);
					} else {
						                                const keys = (key_list_index < key_list_list.length && key_list_list[key_list_index]) || Object.keys(obj);
						                                        for (k = 0; k < keys.length; k++) {
							                                        if (obj.hasOwnProperty(keys[k])) {
								                                        tmp_intermediate.push(obj[keys[k]]);
							}
						}
					}
				}
				                                        intermediate = tmp_intermediate;
				                                        key_list_index += 1;
			}
			// flatten, if data is found (when not found, it means it is a missing key)
			                                        if (ret.length > 0) {
				                                        ret = flatten(ret);
			}
			                                        return ret;
		};
		                                        this.missingKeys = function (key_list_list) {
			// TODO: implement this without slow reference to getData
			                                const missing_keys = key_list_list.map(() => { return {}; });
			                                    let j, k;
			                                const key_combinations = keyCombinations(key_list_list, true);
			                                        for (k = 0; k < key_combinations.length; k++) {
				                                        if (this.getData(key_combinations[k]).length === 0) {
					                                        for (j = 0; j < key_combinations[k].length; j++) {
						                                        missing_keys[j][key_combinations[k][j]] = true;
					}
				}
			}
			                                        return missing_keys.map((o) => { return Object.keys(o); });
		};
	}

	                                const makeOneIndexService = function (arg_name, indexKeyFn, service_fn_name) {
		                                        return (function () {
			                                const index = new Index(indexKeyFn);
			                                    let loaded_all = false;
			                                        return function (args) {
				                                        args = args || {};
				                                const def = new $.Deferred();
				                                        try {
					                                        if (args.hasOwnProperty(arg_name)) {
						                                const missing_keys = index.missingKeys(args[arg_name]);
						                                        if (missing_keys.length > 0) {
							                                const webservice_args = {};
							                                        webservice_args[arg_name] = missing_keys;
							                                        raw_service[service_fn_name](webservice_args).then((data) => {
								                                        index.addData(data);
								                                        def.resolve(index.getData(args[arg_name]));
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index.getData(args[arg_name]));
						}
					} else {
						                                        if (!loaded_all) {
							                                        raw_service[service_fn_name]({}).then((data) => {
								                                        index.addData(data);
								                                        loaded_all = true;
								                                        def.resolve(index.getData());
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index.getData());
						}
					}
				} catch (err) {
					                                        def.reject();
				}
				                                        return def.promise();
			};
		})();
	};
	                                const makeTwoIndexService = function (arg_name1, indexKeyFn1, index1_always_add, arg_name2, indexKeyFn2, index2_always_add, service_fn_name) {
		                                        return (function () {
			                                const index1 = new Index(indexKeyFn1);
			                                const index2 = new Index(indexKeyFn2);
			                                    let loaded_all = false;
			                                        return function (args) {
				                                        args = args || {};
				                                const def = new $.Deferred();
				                                        try {
					                                        if (args.hasOwnProperty(arg_name1)) {
						                                        var missing_keys = index1.missingKeys(args[arg_name1]);
						                                        if (missing_keys.length > 0) {
							                                        var webservice_args = {};
							                                        webservice_args[arg_name1] = missing_keys;
							                                        raw_service[service_fn_name](webservice_args).then((data) => {
								                                        index1.addData(data);
								                                        if (index2_always_add) {
									                                        index2.addData(data);
								}
								                                        def.resolve(index1.getData(args[arg_name1]));
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index1.getData(args[arg_name1]));
						}
					} else if (args.hasOwnProperty(arg_name2)) {
						                                        var missing_keys = index2.missingKeys(args[arg_name2]);
						                                        if (missing_keys.length > 0) {
							                                        var webservice_args = {};
							                                        webservice_args[arg_name2] = missing_keys;
							                                        raw_service[service_fn_name](webservice_args).then((data) => {
								                                        index2.addData(data);
								                                        if (index1_always_add) {
									                                        index1.addData(data);
								}
								                                        def.resolve(index2.getData(args[arg_name2]));
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index2.getData(args[arg_name2]));
						}
					} else {
						                                        if (!loaded_all) {
							                                        raw_service[service_fn_name]({}).then((data) => {
								                                        index1.addData(data);
								                                        index2.addData(data);
								                                        loaded_all = true;
								                                        def.resolve(index1.getData());
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index1.getData());
						}
					}
				} catch (err) {
					                                        def.reject();
				}
				                                        return def.promise();
			};
		})();
	};

	                                const makeHierIndexService = function (arg_names, indexing_attrs, service_fn_name) {
		                                        return (function () {
			                                const index = new HierIndex((d) => {
				                                const ret = [];
				                                        for (let i = 0; i < indexing_attrs.length; i++) {
					                                        ret.push(d[indexing_attrs[i]]);
				}
				                                        return ret;
			});
			                                        return function (args) {
				                                const def = new $.Deferred();
				                                        try {
					                                const arg_list_list = arg_names.map((a) => {
						                                        return args[a];
					});
					                                        while (typeof arg_list_list[arg_list_list.length - 1] === 'undefined') {
						                                        arg_list_list.pop();
					}
					                                        if (arg_list_list.length < arg_names.length) {
						                                    let missing_arg_set_list = arg_list_list.map((a) => {
							                                        return {};
						});
						                                const key_combs = keyCombinations(arg_list_list);
						                                const missing_key_combs = [];
						                                        for (var i = 0; i < key_combs.length; i++) {
							                                        if (!index.isFullyLoaded(key_combs[i])) {
								                                        missing_key_combs.push(key_combs[i]);
								                                        for (let j = 0; j < key_combs[i].length; j++) {
									                                        missing_arg_set_list[j][key_combs[i][j]] = true;
								}
							}
						}
						                                        missing_arg_set_list = missing_arg_set_list.map((o) => {
							                                        return Object.keys(o);
						});
						                                        if (missing_arg_set_list[0].length > 0) {
							                                        var webservice_args = {};
							                                        for (var i = 0; i < missing_arg_set_list.length; i++) {
								                                        webservice_args[arg_names[i]] = missing_arg_set_list[i];
							}
							                                        raw_service[service_fn_name](webservice_args).then((data) => {
								                                        for (let j = 0; j < missing_key_combs.length; j++) {
									                                        index.markFullyLoaded(missing_key_combs[j]);
								}
								                                        index.addData(data);
								                                        def.resolve(index.getData(arg_list_list));
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index.getData(arg_list_list));
						}
					} else {
						                                const missing_keys = index.missingKeys(arg_list_list);
						                                        if (missing_keys[0].length > 0) {
							                                        var webservice_args = {};
							                                        for (var i = 0; i < missing_keys.length; i++) {
								                                        webservice_args[arg_names[i]] = missing_keys[i];
							}
							                                        raw_service[service_fn_name](webservice_args).then((data) => {
								                                        index.addData(data);
								                                        def.resolve(index.getData(arg_list_list));
							}).fail(() => {
								                                        def.reject();
							});
						} else {
							                                        def.resolve(index.getData(arg_list_list));
						}
					}
				} catch (err) {
					                                        def.reject();
				}
				                                        return def.promise();
			};
		})();
	};
	// TODO: abstract this correctly so there isn't more than one index, more than one index service maker?
	                                const enforceRequiredArguments = function (fnPtr, list_of_arg_combinations) {
			                                        return function (args) {
				                                        args = args || {};
				                                    let matches_one = false;
				                                        for (let i = 0; i < list_of_arg_combinations.length; i++) {
					                                const combination = list_of_arg_combinations[i];
					                                    let matches_combo = true;
					                                        for (let j = 0; j < combination.length; j++) {
						                                        matches_combo = matches_combo && args.hasOwnProperty(combination[j]);
					}
					                                        if (matches_combo) {
						                                        matches_one = true;
						                                        break;
					}
				}
				                                        if (!matches_one) {
					                                const def = new $.Deferred();
					                                    let msg = 'Given arguments not acceptable; need a combination in the following list: ';
					                                        msg += list_of_arg_combinations.map((arg_combo) => { return arg_combo.join(','); }).join(';');
					                                        def.reject({ msg });
					                                        return def.promise();
				} else {
					                                        return fnPtr(args);
				}
			};
	};

	                                const cached_service = {
		                                        getCancerTypes: enforceRequiredArguments(makeOneIndexService('cancer_type_ids', (d) => { return d.id; }, 'getCancerTypes'), [[], ['cancer_type_ids']]),
		                                        getGenes: enforceRequiredArguments(makeOneIndexService('hugo_gene_symbols', (d) => { return d.hugo_gene_symbol; }, 'getGenes'), [[], ['hugo_gene_symbols']]),
		                                        getStudies: enforceRequiredArguments(makeOneIndexService('study_ids', (d) => { return d.id; }, 'getStudies'), [[], ['study_ids']]),
		                                        getGeneticProfiles: enforceRequiredArguments(makeTwoIndexService('study_id', (d) => { return d.study_id; }, false, 'genetic_profile_ids', (d) => { return d.id; }, true, 'getGeneticProfiles'), [['study_id'], ['genetic_profile_ids']]),
		                                        getSampleLists: enforceRequiredArguments(makeTwoIndexService('study_id', (d) => { return d.study_id; }, false, 'sample_list_ids', (d) => { return d.id; }, true, 'getSampleLists'), [['study_id'], ['sample_list_ids']]),
		                                        getSampleClinicalData: enforceRequiredArguments(makeHierIndexService(['study_id', 'attribute_ids', 'sample_ids'], ['study_id', 'attr_id', 'sample_id'], 'getSampleClinicalData'), [['study_id', 'attribute_ids'], ['study_id', 'attribute_ids', 'sample_ids']]),
		                                        getPatientClinicalData: enforceRequiredArguments(makeHierIndexService(['study_id', 'attribute_ids', 'patient_ids'], ['study_id', 'attr_id', 'patient_id'], 'getPatientClinicalData'), [['study_id', 'attribute_ids'], ['study_id', 'attribute_ids', 'patient_ids']]),
		                                        getPatients: enforceRequiredArguments(makeHierIndexService(['study_id', 'patient_ids'], ['study_id', 'id'], 'getPatients'), [['study_id'], ['study_id', 'patient_ids']]),
		                                        getSamples: enforceRequiredArguments(makeHierIndexService(['study_id', 'sample_ids'], ['study_id', 'id'], 'getSamples'), [['study_id'], ['study_id', 'sample_ids']]),
		                                        getSamplesByPatient: enforceRequiredArguments(makeHierIndexService(['study_id', 'patient_ids'], ['study_id', 'patient_id'], 'getSamples'), [['study_id'], ['study_id', 'patient_ids']]),
		                                        getGeneticProfileDataBySample: enforceRequiredArguments(makeHierIndexService(['genetic_profile_ids', 'genes', 'sample_ids'], ['genetic_profile_id', 'hugo_gene_symbol', 'sample_id'], 'getGeneticProfileData'), [['genetic_profile_ids', 'genes'], ['genetic_profile_ids', 'genes', 'sample_ids']]),
    getGeneticProfileDataBySampleList: enforceRequiredArguments(makeHierIndexService(['genetic_profile_ids', 'genes', 'sample_list_id'], ['genetic_profile_id', 'hugo_gene_symbol', 'sample_list_id'], 'getGeneticProfileData'), [['genetic_profile_ids', 'genes'], ['genetic_profile_ids', 'genes', 'sample_list_id']]),
		                                        getSampleClinicalAttributes: enforceRequiredArguments((args) => {
			                                        return raw_service.getSampleClinicalAttributes(args);
		}, [['study_id'], ['study_id', 'sample_ids']]),
		                                        getPatientClinicalAttributes: enforceRequiredArguments((args) => {
			                                        return raw_service.getPatientClinicalAttributes(args);
		}, [['study_id'], ['study_id', 'patient_ids']]),
		                                        getClinicalAttributes: enforceRequiredArguments(makeOneIndexService('attr_ids', (d) => { return d.attr_id; }, 'getClinicalAttributes'), [[], ['attr_ids']]),
		                                        getMutationCounts: raw_service.getMutationCounts,
	};
	                                        return cached_service;
})();
export default cbioportal_client;
