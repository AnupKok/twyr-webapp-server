exports.up = async function(knex) {
	let exists = null;

	// Step 1: Create the "tenants_features" table
	exists = await knex.schema.withSchema('public').hasTable('tenants_features');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenants_features', function(tenantFeatureTbl) {
			tenantFeatureTbl.uuid('tenant_id').notNullable().references('tenant_id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantFeatureTbl.uuid('module_id').notNullable().references('module_id').inTable('modules').onDelete('CASCADE').onUpdate('CASCADE');
			tenantFeatureTbl.uuid('tenant_feature_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
			tenantFeatureTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantFeatureTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantFeatureTbl.primary(['tenant_id', 'module_id']);
			tenantFeatureTbl.unique(['tenant_feature_id']);
		});
	}

	// Step 2: Create the "tenant_group_permissions" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_group_permissions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_group_permissions', function(groupPermissionTbl) {
			groupPermissionTbl.uuid('tenant_id').notNullable();
			groupPermissionTbl.uuid('group_id').notNullable();

			groupPermissionTbl.uuid('module_id').notNullable();
			groupPermissionTbl.uuid('feature_permission_id').notNullable();

			groupPermissionTbl.uuid('tenant_group_permission_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
			groupPermissionTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			groupPermissionTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			groupPermissionTbl.primary(['tenant_id', 'group_id', 'module_id', 'feature_permission_id']);
			groupPermissionTbl.unique(['tenant_group_permission_id']);

			groupPermissionTbl.foreign(['module_id', 'feature_permission_id']).references(['module_id', 'feature_permission_id']).inTable('feature_permissions').onDelete('CASCADE').onUpdate('CASCADE');
			groupPermissionTbl.foreign(['tenant_id', 'group_id']).references(['tenant_id', 'group_id']).inTable('tenant_groups').onDelete('CASCADE').onUpdate('CASCADE');

			groupPermissionTbl.foreign(['tenant_id', 'module_id']).references(['tenant_id', 'module_id']).inTable('tenants_features').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 3: Create the "tenant_templates" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_templates', function(tmplTbl) {
			tmplTbl.uuid('tenant_id').notNullable().references('tenant_id');
			tmplTbl.uuid('module_id').notNullable().references('module_id');
			tmplTbl.uuid('tenant_template_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
			tmplTbl.text('name').notNullable();
			tmplTbl.text('display_name').notNullable();
			tmplTbl.text('relative_path_to_index').notNullable().defaultTo('dist/index.html');
			tmplTbl.text('description');
			tmplTbl.boolean('default').notNullable().defaultTo(false);
			tmplTbl.jsonb('configuration').notNullable().defaultTo('{}');
			tmplTbl.jsonb('configuration_schema').notNullable().defaultTo('{}');
			tmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tmplTbl.primary(['tenant_id', 'module_id', 'tenant_template_id']);
			tmplTbl.foreign(['tenant_id', 'module_id']).references(['tenant_id', 'module_id']).inTable('tenants_features').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 4: Create the "tenant_template_positions" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_template_positions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_template_positions', function(tmplPositionTbl) {
			tmplPositionTbl.uuid('tenant_id').notNullable();
			tmplPositionTbl.uuid('module_id').notNullable().references('module_id');
			tmplPositionTbl.uuid('tenant_template_id').notNullable();
			tmplPositionTbl.uuid('tenant_template_position_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
			tmplPositionTbl.text('name').notNullable();
			tmplPositionTbl.text('display_name').notNullable();
			tmplPositionTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tmplPositionTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tmplPositionTbl.primary(['tenant_id', 'module_id', 'tenant_template_id', 'tenant_template_position_id']);
			tmplPositionTbl.foreign(['tenant_id', 'module_id', 'tenant_template_id']).references(['tenant_id', 'module_id', 'tenant_template_id']).inTable('tenant_templates').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 5: Create the "tenant_template_positions_feature_frontend_components" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_template_positions_feature_frontend_components');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_template_positions_feature_frontend_components', function(positionFrontEndComponentTbl) {
			positionFrontEndComponentTbl.uuid('tenant_id').notNullable();
			positionFrontEndComponentTbl.uuid('module_id').notNullable();
			positionFrontEndComponentTbl.uuid('tenant_template_id').notNullable();
			positionFrontEndComponentTbl.uuid('tenant_template_position_id').notNullable();
			positionFrontEndComponentTbl.uuid('feature_frontend_component_id').notNullable();

			positionFrontEndComponentTbl.uuid('tenant_template_positions_feature_frontend_component_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
			positionFrontEndComponentTbl.jsonb('configuration').notNullable().defaultTo('{}');
			positionFrontEndComponentTbl.jsonb('visibility').notNullable().defaultTo(`{ "users": ["*"], "groups": ["*"], "paths": ["*"] }`);

			positionFrontEndComponentTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			positionFrontEndComponentTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			positionFrontEndComponentTbl.primary(['tenant_id', 'module_id', 'tenant_template_id', 'tenant_template_position_id', 'feature_frontend_component_id']);
			positionFrontEndComponentTbl.unique(['tenant_template_positions_feature_frontend_component_id']);

			positionFrontEndComponentTbl.foreign(['module_id', 'feature_frontend_component_id']).references(['module_id', 'feature_frontend_component_id']).inTable('feature_frontend_components').onDelete('CASCADE').onUpdate('CASCADE');
			positionFrontEndComponentTbl.foreign(['tenant_id', 'module_id', 'tenant_template_id', 'tenant_template_position_id']).references(['tenant_id', 'module_id', 'tenant_template_id', 'tenant_template_position_id']).inTable('tenant_template_positions').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 6: Setup user-defined functions on the tenant_templates table for getting the template for a tenant for a server
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_tenant_template (IN tenantid uuid, IN moduleid uuid)
	RETURNS TABLE (tenant_domain text, tmpl_name text, path_to_index text, configuration jsonb)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	tenant_uuid		UUID;
	tenant_domain	TEXT;
	tmpl_name		TEXT;
	index_path		TEXT;
	configuration	JSONB;
BEGIN
	tenant_uuid		:= NULL;
	tenant_domain	:= NULL;
	tmpl_name		:= NULL;
	index_path		:= NULL;
	configuration	:= NULL;

	IF tenantid IS NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Tenant ID is required';
		RETURN;
	END IF;

	IF moduleid IS NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Server ID is required';
		RETURN;
	END IF;

	SELECT
		A.sub_domain,
		B.name,
		B.relative_path_to_index,
		B.configuration
	FROM
		tenants A LEFT OUTER JOIN
		tenant_templates B ON (B.tenant_id = A.tenant_id)
	WHERE
		A.tenant_id = tenantid AND
		A.enabled = true AND
		B.module_id = moduleid AND
		coalesce(B.default, true) = true
	INTO
		tenant_domain,
		tmpl_name,
		index_path,
		configuration;

	IF tmpl_name IS NOT NULL
	THEN
		RETURN QUERY SELECT tenant_domain, tmpl_name, index_path, configuration;
		RETURN;
	END IF;

	IF tenant_domain IS NULL
	THEN
		tenant_domain := '.www';
	END IF;

	SELECT
		A.tenant_id
	FROM
		tenants A
	WHERE
		A.sub_domain = (SELECT array_to_string(ARRAY(SELECT unnest(string_to_array(tenant_domain, '.')) OFFSET 1), '.'))
	INTO
		tenant_uuid;

	RETURN QUERY
	SELECT
		*
	FROM
		fn_get_tenant_template(tenant_uuid, moduleid);
END;
$$;`
	);

	// Step 7: Enforce rules for sanity using triggers.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_tenant_feature_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_feature			INTEGER;
	feature_parent		UUID;
	is_admin_only		TEXT;
	tenant_sub_domain	TEXT;
BEGIN
	is_feature := 0;
	SELECT
		count(module_id)
	FROM
		modules
	WHERE
		module_id = NEW.module_id AND
		(type = 'feature' OR type = 'server')
	INTO
		is_feature;

	IF is_feature <= 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only Servers and Features can be mapped to tenants';
		RETURN NULL;
	END IF;

	feature_parent := NULL;
	SELECT
		parent_module_id
	FROM
		modules
	WHERE
		module_id = NEW.module_id
	INTO
		feature_parent;

	IF feature_parent IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF feature_parent IS NOT NULL
	THEN
		is_feature := 0;
		SELECT
			count(tenant_feature_id)
		FROM
			tenants_features
		WHERE
			tenant_id = NEW.tenant_id AND
			module_id = feature_parent
		INTO
			is_feature;

		IF is_feature = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Parent feature not mapped to this Tenant';
		END IF;
	END IF;

	is_admin_only := '';
	SELECT
		CAST(deploy AS TEXT)
	FROM
		modules
	WHERE
		module_id = NEW.module_id
	INTO
		is_admin_only;

	IF is_admin_only <> 'admin'
	THEN
		RETURN NEW;
	END IF;

	tenant_sub_domain := '';
	SELECT
		sub_domain
	FROM
		tenants
	WHERE
		tenant_id = NEW.tenant_id
	INTO
		tenant_sub_domain;

	IF tenant_sub_domain <> 'www'
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Admin only components can be mapped only to root tenant';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_feature_to_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	IF NEW.type <> 'feature' AND NEW.type <> 'server'
	THEN
		RETURN NEW;
	END IF;

	IF NEW.type = 'server' OR (NEW.type = 'feature' AND NEW.deploy = 'default')
	THEN
		INSERT INTO tenants_features (
			tenant_id,
			module_id
		)
		SELECT
			tenant_id,
			NEW.module_id
		FROM
			tenants;

		RETURN NEW;
	END IF;

	INSERT INTO tenants_features (
		tenant_id,
		module_id
	)
	SELECT
		tenant_id,
		NEW.module_id
	FROM
		tenants
	WHERE
		sub_domain = 'www';

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_tenant_to_feature ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	INSERT INTO tenants_features (
		tenant_id,
		module_id
	)
	SELECT
		NEW.tenant_id,
		module_id
	FROM
		modules
	WHERE
		type = 'server' OR (type = 'feature' AND deploy = 'default');

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_feature_permissions_to_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	admin_group_id	UUID;
BEGIN
	admin_group_id := NULL;

	SELECT
		group_id
	FROM
		tenant_groups
	WHERE
		tenant_id = NEW.tenant_id AND
		parent_group_id IS NULL
	INTO
		admin_group_id;

	INSERT INTO
		tenant_group_permissions (
			tenant_id,
			group_id,
			module_id,
			feature_permission_id
		)
	SELECT
		NEW.tenant_id,
		admin_group_id,
		NEW.module_id,
		feature_permission_id
	FROM
		feature_permissions
	WHERE
		module_id = NEW.module_id;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_descendant_feature_from_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenants_features
	WHERE
		tenant_id = OLD.tenant_id AND
		module_id IN (SELECT module_id FROM fn_get_module_descendants(OLD.module_id) WHERE level = 2);

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_group_permission_from_descendants ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_group_permissions
	WHERE
		group_id IN (SELECT group_id FROM fn_get_group_descendants(OLD.group_id) WHERE level = 2) AND
		feature_permission_id = OLD.feature_permission_id;

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_group_permission_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	parent_id							UUID;
	does_parent_group_have_permission	INTEGER;
BEGIN
	parent_id := NULL;
	SELECT
		parent_group_id
	FROM
		tenant_groups
	WHERE
		tenant_id = NEW.tenant_id AND
		group_id = NEW.group_id
	INTO
		parent_id;

	IF parent_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	does_parent_group_have_permission := 0;
	SELECT
		count(group_id)
	FROM
		tenant_group_permissions
	WHERE
		group_id = parent_id AND
		feature_permission_id = NEW.feature_permission_id
	INTO
		does_parent_group_have_permission;

	IF does_parent_group_have_permission > 0
	THEN
		RETURN NEW;
	END IF;

	RAISE SQLSTATE '2F003' USING MESSAGE = 'Parent Group does not have this permission';
	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_tenant_template_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_server			INTEGER;
BEGIN
	is_server := 0;
	SELECT
		count(type)
	FROM
		modules
	WHERE
		module_id = NEW.module_id AND
		type = 'server'
	INTO
		is_server;

	IF is_server <= 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only Servers can be mapped to Tenant Templates';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	// Finally, create the triggers...
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_tenant_feature_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenants_features FOR EACH ROW EXECUTE PROCEDURE public.fn_check_tenant_feature_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_feature_to_tenant AFTER INSERT ON public.modules FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_feature_to_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_tenant_to_feature AFTER INSERT ON public.tenants FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_tenant_to_feature();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_feature_permissions_to_tenant AFTER INSERT ON public.tenants_features FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_feature_permissions_to_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_descendant_feature_from_tenant AFTER DELETE ON public.tenants_features FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_descendant_feature_from_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_group_permission_from_descendants AFTER DELETE ON public.tenant_group_permissions FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_group_permission_from_descendants();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_group_permission_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenant_group_permissions FOR EACH ROW EXECUTE PROCEDURE public.fn_check_group_permission_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_tenant_template_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenant_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_check_tenant_template_upsert_is_valid();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_tenant_template_upsert_is_valid ON public.tenant_templates CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_group_permission_upsert_is_valid ON public.tenant_group_permissions CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_group_permission_from_descendants ON public.tenant_group_permissions CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_descendant_feature_from_tenant ON public.tenants_features CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_tenant_feature_upsert_is_valid ON public.tenants_features CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_feature_permissions_to_tenant ON public.tenants_features CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_tenant_to_feature ON public.tenants CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_feature_to_tenant ON public.modules CASCADE;');

	await knex.raw('DROP FUNCTION IF EXISTS public.fn_check_tenant_template_upsert_is_valid () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_check_group_permission_upsert_is_valid () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_group_permission_from_descendants () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_descendant_feature_from_tenant () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_check_tenant_feature_upsert_is_valid () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_feature_permissions_to_tenant () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_tenant_to_feature () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_feature_to_tenant () CASCADE;');
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_tenant_template (IN uuid, IN uuid)`);

	await knex.raw('DROP TABLE IF EXISTS public.tenant_template_positions_feature_frontend_components CASCADE;');
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_template_positions CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_templates CASCADE;`);
	await knex.raw('DROP TABLE IF EXISTS public.tenant_group_permissions CASCADE;');
	await knex.raw('DROP TABLE IF EXISTS public.tenants_features CASCADE;');
};
